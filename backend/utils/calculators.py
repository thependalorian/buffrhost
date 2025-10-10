"""
Calculation Utilities
Business logic calculations for hospitality metrics and analytics
"""

from typing import List, Dict, Any, Optional, Union
from datetime import datetime, date, timedelta
from decimal import Decimal
import statistics

def calculate_occupancy(
    total_rooms: int, 
    occupied_rooms: int, 
    out_of_order_rooms: int = 0
) -> float:
    """
    Calculate occupancy rate percentage
    """
    if total_rooms <= 0:
        return 0.0
    
    available_rooms = total_rooms - out_of_order_rooms
    if available_rooms <= 0:
        return 0.0
    
    occupancy_rate = (occupied_rooms / available_rooms) * 100
    return round(occupancy_rate, 2)

def calculate_revenue(
    room_revenue: float,
    food_beverage_revenue: float = 0.0,
    other_revenue: float = 0.0,
    taxes: float = 0.0,
    discounts: float = 0.0
) -> Dict[str, float]:
    """
    Calculate total revenue and breakdown
    """
    gross_revenue = room_revenue + food_beverage_revenue + other_revenue
    net_revenue = gross_revenue - discounts
    total_revenue = net_revenue + taxes
    
    return {
        "room_revenue": round(room_revenue, 2),
        "food_beverage_revenue": round(food_beverage_revenue, 2),
        "other_revenue": round(other_revenue, 2),
        "gross_revenue": round(gross_revenue, 2),
        "discounts": round(discounts, 2),
        "net_revenue": round(net_revenue, 2),
        "taxes": round(taxes, 2),
        "total_revenue": round(total_revenue, 2)
    }

def calculate_adr(room_revenue: float, occupied_rooms: int) -> float:
    """
    Calculate Average Daily Rate (ADR)
    """
    if occupied_rooms <= 0:
        return 0.0
    
    adr = room_revenue / occupied_rooms
    return round(adr, 2)

def calculate_revpar(room_revenue: float, total_rooms: int) -> float:
    """
    Calculate Revenue Per Available Room (RevPAR)
    """
    if total_rooms <= 0:
        return 0.0
    
    revpar = room_revenue / total_rooms
    return round(revpar, 2)

def calculate_trevpar(
    total_revenue: float, 
    total_rooms: int
) -> float:
    """
    Calculate Total Revenue Per Available Room (TrevPAR)
    """
    if total_rooms <= 0:
        return 0.0
    
    trevpar = total_revenue / total_rooms
    return round(trevpar, 2)

def calculate_arpu(total_revenue: float, total_guests: int) -> float:
    """
    Calculate Average Revenue Per User (ARPU)
    """
    if total_guests <= 0:
        return 0.0
    
    arpu = total_revenue / total_guests
    return round(arpu, 2)

def calculate_length_of_stay(check_in: datetime, check_out: datetime) -> int:
    """
    Calculate length of stay in nights
    """
    if not check_in or not check_out:
        return 0
    
    stay_duration = check_out - check_in
    return max(0, stay_duration.days)

def calculate_average_length_of_stay(stays: List[Dict[str, datetime]]) -> float:
    """
    Calculate average length of stay from list of stays
    """
    if not stays:
        return 0.0
    
    total_nights = 0
    valid_stays = 0
    
    for stay in stays:
        check_in = stay.get("check_in")
        check_out = stay.get("check_out")
        
        if check_in and check_out:
            nights = calculate_length_of_stay(check_in, check_out)
            if nights > 0:
                total_nights += nights
                valid_stays += 1
    
    if valid_stays == 0:
        return 0.0
    
    return round(total_nights / valid_stays, 2)

def calculate_room_nights(bookings: List[Dict[str, Any]]) -> int:
    """
    Calculate total room nights from bookings
    """
    total_nights = 0
    
    for booking in bookings:
        check_in = booking.get("check_in")
        check_out = booking.get("check_out")
        room_count = booking.get("room_count", 1)
        
        if check_in and check_out:
            nights = calculate_length_of_stay(check_in, check_out)
            total_nights += nights * room_count
    
    return total_nights

def calculate_guest_satisfaction_score(
    ratings: List[float], 
    weights: Optional[List[float]] = None
) -> float:
    """
    Calculate weighted guest satisfaction score
    """
    if not ratings:
        return 0.0
    
    if weights and len(weights) == len(ratings):
        # Weighted average
        weighted_sum = sum(rating * weight for rating, weight in zip(ratings, weights))
        total_weight = sum(weights)
        return round(weighted_sum / total_weight, 2)
    else:
        # Simple average
        return round(sum(ratings) / len(ratings), 2)

def calculate_forecast_accuracy(
    actual_values: List[float], 
    forecast_values: List[float]
) -> Dict[str, float]:
    """
    Calculate forecast accuracy metrics
    """
    if len(actual_values) != len(forecast_values) or not actual_values:
        return {"mape": 0.0, "mae": 0.0, "rmse": 0.0}
    
    # Mean Absolute Percentage Error (MAPE)
    mape_values = []
    for actual, forecast in zip(actual_values, forecast_values):
        if actual != 0:
            mape_values.append(abs((actual - forecast) / actual) * 100)
    
    mape = statistics.mean(mape_values) if mape_values else 0.0
    
    # Mean Absolute Error (MAE)
    mae = statistics.mean(abs(actual - forecast) for actual, forecast in zip(actual_values, forecast_values))
    
    # Root Mean Square Error (RMSE)
    mse = statistics.mean((actual - forecast) ** 2 for actual, forecast in zip(actual_values, forecast_values))
    rmse = mse ** 0.5
    
    return {
        "mape": round(mape, 2),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2)
    }

def calculate_demand_elasticity(
    price_changes: List[float], 
    demand_changes: List[float]
) -> float:
    """
    Calculate price elasticity of demand
    """
    if len(price_changes) != len(demand_changes) or not price_changes:
        return 0.0
    
    # Calculate percentage changes
    price_pct_changes = [(p - 100) / 100 for p in price_changes]
    demand_pct_changes = [(d - 100) / 100 for d in demand_changes]
    
    # Calculate elasticity
    elasticity_values = []
    for price_pct, demand_pct in zip(price_pct_changes, demand_pct_changes):
        if price_pct != 0:
            elasticity = demand_pct / price_pct
            elasticity_values.append(elasticity)
    
    return round(statistics.mean(elasticity_values), 2) if elasticity_values else 0.0

def calculate_seasonality_index(
    monthly_data: List[Dict[str, Union[str, float]]]
) -> Dict[str, float]:
    """
    Calculate seasonality index for each month
    """
    if not monthly_data:
        return {}
    
    # Group data by month
    monthly_totals = {}
    for data_point in monthly_data:
        month = data_point.get("month")
        value = data_point.get("value", 0)
        
        if month:
            if month not in monthly_totals:
                monthly_totals[month] = []
            monthly_totals[month].append(value)
    
    # Calculate average for each month
    monthly_averages = {}
    for month, values in monthly_totals.items():
        monthly_averages[month] = statistics.mean(values)
    
    # Calculate overall average
    overall_average = statistics.mean(monthly_averages.values()) if monthly_averages else 0
    
    # Calculate seasonality index
    seasonality_index = {}
    for month, average in monthly_averages.items():
        if overall_average > 0:
            index = (average / overall_average) * 100
            seasonality_index[month] = round(index, 2)
        else:
            seasonality_index[month] = 100.0
    
    return seasonality_index

def calculate_break_even_point(
    fixed_costs: float, 
    variable_cost_per_unit: float, 
    price_per_unit: float
) -> float:
    """
    Calculate break-even point in units
    """
    if price_per_unit <= variable_cost_per_unit:
        return float('inf')  # Cannot break even
    
    contribution_margin = price_per_unit - variable_cost_per_unit
    break_even_units = fixed_costs / contribution_margin
    
    return round(break_even_units, 2)

def calculate_profit_margin(
    revenue: float, 
    costs: float
) -> float:
    """
    Calculate profit margin percentage
    """
    if revenue <= 0:
        return 0.0
    
    profit = revenue - costs
    margin = (profit / revenue) * 100
    
    return round(margin, 2)

def calculate_roi(
    investment: float, 
    returns: float
) -> float:
    """
    Calculate Return on Investment (ROI) percentage
    """
    if investment <= 0:
        return 0.0
    
    roi = ((returns - investment) / investment) * 100
    
    return round(roi, 2)

def calculate_customer_lifetime_value(
    average_order_value: float,
    purchase_frequency: float,
    customer_lifespan: float,
    gross_margin: float
) -> float:
    """
    Calculate Customer Lifetime Value (CLV)
    """
    clv = average_order_value * purchase_frequency * customer_lifespan * gross_margin
    
    return round(clv, 2)

def calculate_churn_rate(
    customers_at_start: int,
    customers_at_end: int,
    new_customers: int
) -> float:
    """
    Calculate customer churn rate percentage
    """
    if customers_at_start <= 0:
        return 0.0
    
    churned_customers = customers_at_start - customers_at_end + new_customers
    churn_rate = (churned_customers / customers_at_start) * 100
    
    return round(churn_rate, 2)

def calculate_net_promoter_score(
    promoters: int,
    detractors: int,
    total_responses: int
) -> float:
    """
    Calculate Net Promoter Score (NPS)
    """
    if total_responses <= 0:
        return 0.0
    
    promoter_percentage = (promoters / total_responses) * 100
    detractor_percentage = (detractors / total_responses) * 100
    
    nps = promoter_percentage - detractor_percentage
    
    return round(nps, 2)

def calculate_comp_set_analysis(
    property_metrics: Dict[str, float],
    competitor_metrics: List[Dict[str, float]]
) -> Dict[str, Any]:
    """
    Calculate competitive set analysis
    """
    if not competitor_metrics:
        return {"index": 100.0, "rank": 1, "percentile": 100.0}
    
    # Extract competitor values for each metric
    competitor_values = {}
    for metric in property_metrics.keys():
        values = [comp.get(metric, 0) for comp in competitor_metrics if comp.get(metric) is not None]
        if values:
            competitor_values[metric] = values
    
    # Calculate index for each metric
    metric_indices = {}
    for metric, property_value in property_metrics.items():
        if metric in competitor_values and competitor_values[metric]:
            competitor_avg = statistics.mean(competitor_values[metric])
            if competitor_avg > 0:
                index = (property_value / competitor_avg) * 100
                metric_indices[metric] = round(index, 2)
            else:
                metric_indices[metric] = 100.0
    
    # Calculate overall index
    overall_index = statistics.mean(metric_indices.values()) if metric_indices else 100.0
    
    # Calculate rank and percentile
    all_values = []
    for comp in competitor_metrics:
        comp_value = sum(comp.get(metric, 0) for metric in property_metrics.keys())
        all_values.append(comp_value)
    
    property_total = sum(property_metrics.values())
    all_values.append(property_total)
    all_values.sort(reverse=True)
    
    rank = all_values.index(property_total) + 1
    percentile = ((len(all_values) - rank) / (len(all_values) - 1)) * 100
    
    return {
        "overall_index": round(overall_index, 2),
        "metric_indices": metric_indices,
        "rank": rank,
        "percentile": round(percentile, 2),
        "total_competitors": len(competitor_metrics)
    }
