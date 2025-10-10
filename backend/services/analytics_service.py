"""
Analytics Service
Comprehensive business intelligence, reporting, and data analytics
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc, asc
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta, date
import logging
import statistics
from collections import defaultdict

from models.booking import Booking
from models.hospitality_property import HospitalityProperty
from models.room import Room
from models.user import User
from utils.calculators import calculate_occupancy, calculate_adr, calculate_revpar, calculate_trevpar

logger = logging.getLogger(__name__)

class AnalyticsService:
    """Comprehensive analytics and reporting service"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_revenue_analytics(
        self, 
        property_id: str, 
        start_date: datetime, 
        end_date: datetime,
        group_by: str = "day"
    ) -> Dict[str, Any]:
        """Get comprehensive revenue analytics"""
        try:
            # Base query for bookings in date range
            base_query = self.db.query(Booking).filter(
                Booking.property_id == property_id,
                Booking.status.in_(['confirmed', 'checked_in', 'checked_out']),
                Booking.check_in >= start_date,
                Booking.check_in <= end_date
            )
            
            # Revenue by time period
            if group_by == "day":
                revenue_data = base_query.with_entities(
                    func.date(Booking.check_in).label('date'),
                    func.sum(Booking.total_amount).label('revenue'),
                    func.count(Booking.id).label('bookings'),
                    func.avg(Booking.total_amount).label('avg_booking_value')
                ).group_by(func.date(Booking.check_in)).all()
            elif group_by == "week":
                revenue_data = base_query.with_entities(
                    func.date_trunc('week', Booking.check_in).label('week'),
                    func.sum(Booking.total_amount).label('revenue'),
                    func.count(Booking.id).label('bookings'),
                    func.avg(Booking.total_amount).label('avg_booking_value')
                ).group_by(func.date_trunc('week', Booking.check_in)).all()
            elif group_by == "month":
                revenue_data = base_query.with_entities(
                    func.date_trunc('month', Booking.check_in).label('month'),
                    func.sum(Booking.total_amount).label('revenue'),
                    func.count(Booking.id).label('bookings'),
                    func.avg(Booking.total_amount).label('avg_booking_value')
                ).group_by(func.date_trunc('month', Booking.check_in)).all()
            
            # Calculate totals
            total_revenue = sum(row.revenue for row in revenue_data if row.revenue)
            total_bookings = sum(row.bookings for row in revenue_data if row.bookings)
            avg_booking_value = total_revenue / total_bookings if total_bookings > 0 else 0
            
            # Revenue by room type
            room_type_revenue = self.db.query(
                Room.room_type_id,
                func.sum(Booking.total_amount).label('revenue'),
                func.count(Booking.id).label('bookings')
            ).join(Booking, Room.id == Booking.room_id).filter(
                Booking.property_id == property_id,
                Booking.status.in_(['confirmed', 'checked_in', 'checked_out']),
                Booking.check_in >= start_date,
                Booking.check_in <= end_date
            ).group_by(Room.room_type_id).all()
            
            # Revenue by guest type (if we had guest segmentation)
            guest_type_revenue = base_query.with_entities(
                Booking.guest_email,
                func.sum(Booking.total_amount).label('revenue'),
                func.count(Booking.id).label('bookings')
            ).group_by(Booking.guest_email).all()
            
            # Calculate growth metrics
            previous_period_start = start_date - (end_date - start_date)
            previous_period_end = start_date
            
            previous_revenue = self.db.query(func.sum(Booking.total_amount)).filter(
                Booking.property_id == property_id,
                Booking.status.in_(['confirmed', 'checked_in', 'checked_out']),
                Booking.check_in >= previous_period_start,
                Booking.check_in < previous_period_end
            ).scalar() or 0
            
            revenue_growth = ((total_revenue - previous_revenue) / previous_revenue * 100) if previous_revenue > 0 else 0
            
            return {
                'property_id': property_id,
                'period': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d'),
                    'group_by': group_by
                },
                'summary': {
                    'total_revenue': float(total_revenue),
                    'total_bookings': total_bookings,
                    'average_booking_value': float(avg_booking_value),
                    'revenue_growth': round(revenue_growth, 2)
                },
                'revenue_trend': [
                    {
                        'date': row.date.strftime('%Y-%m-%d') if hasattr(row, 'date') else str(row.week) if hasattr(row, 'week') else str(row.month),
                        'revenue': float(row.revenue or 0),
                        'bookings': row.bookings or 0,
                        'avg_booking_value': float(row.avg_booking_value or 0)
                    }
                    for row in revenue_data
                ],
                'room_type_breakdown': [
                    {
                        'room_type_id': row.room_type_id,
                        'revenue': float(row.revenue or 0),
                        'bookings': row.bookings or 0
                    }
                    for row in room_type_revenue
                ],
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get revenue analytics: {str(e)}")
            return {}
    
    def get_occupancy_analytics(
        self, 
        property_id: str, 
        start_date: datetime, 
        end_date: datetime
    ) -> Dict[str, Any]:
        """Get comprehensive occupancy analytics"""
        try:
            # Get total rooms
            total_rooms = self.db.query(Room).filter(Room.property_id == property_id).count()
            
            if total_rooms == 0:
                return {'error': 'No rooms found for property'}
            
            # Calculate occupancy for each day
            occupancy_data = []
            current_date = start_date.date()
            end_date_only = end_date.date()
            
            while current_date <= end_date_only:
                # Count occupied rooms for this date
                occupied_rooms = self.db.query(Booking).join(Room).filter(
                    Room.property_id == property_id,
                    Booking.status.in_(['confirmed', 'checked_in']),
                    Booking.check_in <= current_date,
                    Booking.check_out > current_date
                ).count()
                
                # Count out of order rooms
                out_of_order_rooms = self.db.query(Room).filter(
                    Room.property_id == property_id,
                    Room.status == 'out_of_order'
                ).count()
                
                available_rooms = total_rooms - out_of_order_rooms
                occupancy_rate = (occupied_rooms / available_rooms * 100) if available_rooms > 0 else 0
                
                occupancy_data.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'total_rooms': total_rooms,
                    'available_rooms': available_rooms,
                    'occupied_rooms': occupied_rooms,
                    'out_of_order_rooms': out_of_order_rooms,
                    'occupancy_rate': round(occupancy_rate, 2)
                })
                
                current_date += timedelta(days=1)
            
            # Calculate summary metrics
            occupancy_rates = [day['occupancy_rate'] for day in occupancy_data]
            avg_occupancy = statistics.mean(occupancy_rates) if occupancy_rates else 0
            max_occupancy = max(occupancy_rates) if occupancy_rates else 0
            min_occupancy = min(occupancy_rates) if occupancy_rates else 0
            
            # Calculate ADR and RevPAR
            total_revenue = self.db.query(func.sum(Booking.total_amount)).filter(
                Booking.property_id == property_id,
                Booking.status.in_(['confirmed', 'checked_in', 'checked_out']),
                Booking.check_in >= start_date,
                Booking.check_in <= end_date
            ).scalar() or 0
            
            total_room_nights = sum(day['occupied_rooms'] for day in occupancy_data)
            adr = total_revenue / total_room_nights if total_room_nights > 0 else 0
            revpar = (avg_occupancy / 100) * adr if adr > 0 else 0
            
            return {
                'property_id': property_id,
                'period': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d')
                },
                'summary': {
                    'average_occupancy': round(avg_occupancy, 2),
                    'maximum_occupancy': round(max_occupancy, 2),
                    'minimum_occupancy': round(min_occupancy, 2),
                    'average_daily_rate': round(adr, 2),
                    'revenue_per_available_room': round(revpar, 2),
                    'total_room_nights': total_room_nights
                },
                'daily_occupancy': occupancy_data,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get occupancy analytics: {str(e)}")
            return {}
    
    def get_guest_analytics(
        self, 
        property_id: str, 
        days: int = 30
    ) -> Dict[str, Any]:
        """Get comprehensive guest analytics"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get guest data
            guest_data = self.db.query(Booking).filter(
                Booking.property_id == property_id,
                Booking.check_in >= start_date
            ).all()
            
            if not guest_data:
                return {'error': 'No guest data found for the period'}
            
            # Guest demographics
            total_guests = len(guest_data)
            unique_guests = len(set(booking.guest_email for booking in guest_data))
            repeat_guests = total_guests - unique_guests
            
            # Guest origin analysis (if we had country data)
            guest_origins = defaultdict(int)
            for booking in guest_data:
                # This would be enhanced with actual country data
                guest_origins['Unknown'] += 1
            
            # Length of stay analysis
            stay_lengths = []
            for booking in guest_data:
                if booking.check_in and booking.check_out:
                    stay_length = (booking.check_out - booking.check_in).days
                    stay_lengths.append(stay_length)
            
            avg_stay_length = statistics.mean(stay_lengths) if stay_lengths else 0
            
            # Booking patterns
            booking_days = [booking.check_in.weekday() for booking in guest_data if booking.check_in]
            weekday_bookings = defaultdict(int)
            for day in booking_days:
                weekday_bookings[day] += 1
            
            # Guest satisfaction (if we had review data)
            satisfaction_scores = []  # This would come from review system
            avg_satisfaction = 0  # Placeholder
            
            # Revenue per guest
            total_revenue = sum(booking.total_amount for booking in guest_data if booking.total_amount)
            revenue_per_guest = total_revenue / total_guests if total_guests > 0 else 0
            
            return {
                'property_id': property_id,
                'period_days': days,
                'summary': {
                    'total_guests': total_guests,
                    'unique_guests': unique_guests,
                    'repeat_guests': repeat_guests,
                    'repeat_guest_rate': round((repeat_guests / total_guests * 100), 2) if total_guests > 0 else 0,
                    'average_stay_length': round(avg_stay_length, 1),
                    'average_satisfaction': round(avg_satisfaction, 1),
                    'revenue_per_guest': round(revenue_per_guest, 2)
                },
                'demographics': {
                    'guest_origins': dict(guest_origins),
                    'stay_length_distribution': self._get_stay_length_distribution(stay_lengths),
                    'booking_patterns': {
                        'monday': weekday_bookings[0],
                        'tuesday': weekday_bookings[1],
                        'wednesday': weekday_bookings[2],
                        'thursday': weekday_bookings[3],
                        'friday': weekday_bookings[4],
                        'saturday': weekday_bookings[5],
                        'sunday': weekday_bookings[6]
                    }
                },
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get guest analytics: {str(e)}")
            return {}
    
    def get_property_performance(
        self, 
        property_id: str, 
        days: int = 30
    ) -> Dict[str, Any]:
        """Get comprehensive property performance metrics"""
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Get property info
            property = self.db.query(HospitalityProperty).filter(
                HospitalityProperty.id == property_id
            ).first()
            
            if not property:
                return {'error': 'Property not found'}
            
            # Revenue metrics
            revenue_data = self.get_revenue_analytics(property_id, start_date, end_date)
            
            # Occupancy metrics
            occupancy_data = self.get_occupancy_analytics(property_id, start_date, end_date)
            
            # Guest metrics
            guest_data = self.get_guest_analytics(property_id, days)
            
            # Calculate key performance indicators
            kpis = self._calculate_kpis(revenue_data, occupancy_data, guest_data)
            
            # Market comparison (placeholder - would use external data)
            market_comparison = self._get_market_comparison(property_id, kpis)
            
            # Performance trends
            trends = self._calculate_trends(property_id, start_date, end_date)
            
            return {
                'property_id': property_id,
                'property_name': property.property_name,
                'period_days': days,
                'kpis': kpis,
                'revenue_metrics': revenue_data.get('summary', {}),
                'occupancy_metrics': occupancy_data.get('summary', {}),
                'guest_metrics': guest_data.get('summary', {}),
                'market_comparison': market_comparison,
                'trends': trends,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get property performance: {str(e)}")
            return {}
    
    def get_competitive_analysis(
        self, 
        property_id: str, 
        competitor_properties: List[str]
    ) -> Dict[str, Any]:
        """Get competitive analysis against other properties"""
        try:
            # Get current property performance
            current_performance = self.get_property_performance(property_id, 30)
            
            # Get competitor performance (simplified - would use external data)
            competitor_data = []
            for comp_id in competitor_properties:
                comp_performance = self.get_property_performance(comp_id, 30)
                if comp_performance and 'kpis' in comp_performance:
                    competitor_data.append({
                        'property_id': comp_id,
                        'kpis': comp_performance['kpis']
                    })
            
            # Calculate competitive metrics
            competitive_analysis = self._calculate_competitive_metrics(
                current_performance.get('kpis', {}),
                competitor_data
            )
            
            return {
                'property_id': property_id,
                'competitors': len(competitor_properties),
                'analysis': competitive_analysis,
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get competitive analysis: {str(e)}")
            return {}
    
    def get_forecasting_data(
        self, 
        property_id: str, 
        forecast_days: int = 30
    ) -> Dict[str, Any]:
        """Get forecasting data for future planning"""
        try:
            # Get historical data for the last 90 days
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=90)
            
            # Get historical occupancy data
            historical_occupancy = self.get_occupancy_analytics(property_id, start_date, end_date)
            
            # Get historical revenue data
            historical_revenue = self.get_revenue_analytics(property_id, start_date, end_date)
            
            # Simple forecasting (would use ML models in production)
            forecast = self._generate_forecast(
                historical_occupancy,
                historical_revenue,
                forecast_days
            )
            
            return {
                'property_id': property_id,
                'forecast_days': forecast_days,
                'forecast': forecast,
                'confidence_level': 0.75,  # Placeholder
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get forecasting data: {str(e)}")
            return {}
    
    def get_custom_report(
        self, 
        property_id: str, 
        report_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate custom analytics report based on configuration"""
        try:
            report_type = report_config.get('type', 'comprehensive')
            start_date = report_config.get('start_date', datetime.utcnow() - timedelta(days=30))
            end_date = report_config.get('end_date', datetime.utcnow())
            metrics = report_config.get('metrics', ['revenue', 'occupancy', 'guests'])
            
            report_data = {
                'property_id': property_id,
                'report_type': report_type,
                'period': {
                    'start': start_date.strftime('%Y-%m-%d'),
                    'end': end_date.strftime('%Y-%m-%d')
                },
                'metrics': {}
            }
            
            # Generate requested metrics
            if 'revenue' in metrics:
                report_data['metrics']['revenue'] = self.get_revenue_analytics(
                    property_id, start_date, end_date
                )
            
            if 'occupancy' in metrics:
                report_data['metrics']['occupancy'] = self.get_occupancy_analytics(
                    property_id, start_date, end_date
                )
            
            if 'guests' in metrics:
                days = (end_date - start_date).days
                report_data['metrics']['guests'] = self.get_guest_analytics(
                    property_id, days
                )
            
            if 'performance' in metrics:
                days = (end_date - start_date).days
                report_data['metrics']['performance'] = self.get_property_performance(
                    property_id, days
                )
            
            report_data['generated_at'] = datetime.utcnow().isoformat()
            return report_data
            
        except Exception as e:
            logger.error(f"Failed to generate custom report: {str(e)}")
            return {}
    
    def _calculate_kpis(
        self, 
        revenue_data: Dict[str, Any], 
        occupancy_data: Dict[str, Any], 
        guest_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate key performance indicators"""
        revenue_summary = revenue_data.get('summary', {})
        occupancy_summary = occupancy_data.get('summary', {})
        guest_summary = guest_data.get('summary', {})
        
        return {
            'total_revenue': revenue_summary.get('total_revenue', 0),
            'average_occupancy': occupancy_summary.get('average_occupancy', 0),
            'average_daily_rate': occupancy_summary.get('average_daily_rate', 0),
            'revenue_per_available_room': occupancy_summary.get('revenue_per_available_room', 0),
            'total_guests': guest_summary.get('total_guests', 0),
            'repeat_guest_rate': guest_summary.get('repeat_guest_rate', 0),
            'average_stay_length': guest_summary.get('average_stay_length', 0),
            'revenue_growth': revenue_summary.get('revenue_growth', 0)
        }
    
    def _get_market_comparison(
        self, 
        property_id: str, 
        kpis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Get market comparison data (placeholder)"""
        # This would integrate with external market data sources
        return {
            'market_average_occupancy': 65.0,
            'market_average_adr': 150.0,
            'market_average_revpar': 97.5,
            'property_vs_market': {
                'occupancy': kpis.get('average_occupancy', 0) - 65.0,
                'adr': kpis.get('average_daily_rate', 0) - 150.0,
                'revpar': kpis.get('revenue_per_available_room', 0) - 97.5
            }
        }
    
    def _calculate_trends(
        self, 
        property_id: str, 
        start_date: datetime, 
        end_date: datetime
    ) -> Dict[str, Any]:
        """Calculate performance trends"""
        # This would analyze historical data to identify trends
        return {
            'revenue_trend': 'increasing',
            'occupancy_trend': 'stable',
            'guest_satisfaction_trend': 'improving',
            'booking_lead_time_trend': 'decreasing'
        }
    
    def _calculate_competitive_metrics(
        self, 
        current_kpis: Dict[str, Any], 
        competitor_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate competitive analysis metrics"""
        if not competitor_data:
            return {'error': 'No competitor data available'}
        
        # Calculate averages for competitors
        competitor_avg = {}
        for metric in ['average_occupancy', 'average_daily_rate', 'revenue_per_available_room']:
            values = [comp['kpis'].get(metric, 0) for comp in competitor_data if metric in comp['kpis']]
            competitor_avg[metric] = statistics.mean(values) if values else 0
        
        # Calculate competitive position
        competitive_position = {}
        for metric, avg_value in competitor_avg.items():
            current_value = current_kpis.get(metric, 0)
            competitive_position[metric] = {
                'current': current_value,
                'market_average': avg_value,
                'variance': current_value - avg_value,
                'percentile': 75  # Placeholder - would calculate actual percentile
            }
        
        return {
            'competitive_position': competitive_position,
            'market_rank': 3,  # Placeholder
            'strengths': ['occupancy', 'guest_satisfaction'],
            'opportunities': ['pricing', 'marketing']
        }
    
    def _generate_forecast(
        self, 
        historical_occupancy: Dict[str, Any], 
        historical_revenue: Dict[str, Any], 
        forecast_days: int
    ) -> Dict[str, Any]:
        """Generate forecast data (simplified)"""
        # This would use machine learning models in production
        return {
            'forecasted_occupancy': 70.0,
            'forecasted_revenue': 50000.0,
            'forecasted_bookings': 150,
            'confidence_interval': {
                'lower': 60.0,
                'upper': 80.0
            }
        }
    
    def _get_stay_length_distribution(self, stay_lengths: List[int]) -> Dict[str, int]:
        """Get distribution of stay lengths"""
        distribution = defaultdict(int)
        for length in stay_lengths:
            if length <= 1:
                distribution['1 night'] += 1
            elif length <= 3:
                distribution['2-3 nights'] += 1
            elif length <= 7:
                distribution['4-7 nights'] += 1
            else:
                distribution['8+ nights'] += 1
        
        return dict(distribution)