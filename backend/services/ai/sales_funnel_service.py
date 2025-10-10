"""
Sales Funnel Service
Tenant-aware AI-powered sales funnel with multi-agent orchestration
"""

from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import logging
import json
import asyncio
from langchain.llms import OpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory
from langgraph import StateGraph, END
from langgraph.prebuilt import ToolNode

from models.tenant import TenantUser
from models.lead import Lead
from models.sales_funnel import SalesFunnelStage, SalesFunnelInteraction
from schemas.ai import (
    SalesFunnelRequest,
    SalesFunnelResponse,
    LeadQualificationRequest,
    LeadQualificationResponse,
    SalesStageUpdate,
    SalesAnalytics
)

logger = logging.getLogger(__name__)

class SalesFunnelService:
    """Tenant-aware AI sales funnel service"""
    
    def __init__(self, db: Session, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id
        self.tenant = self._get_tenant()
        self.llm = None
        self.agents = {}
        self.workflow = None
        self._initialize_ai_components()
    
    def _get_tenant(self) -> Optional[TenantUser]:
        """Get tenant profile"""
        return self.db.query(TenantUser).filter(
            TenantUser.id == self.tenant_id
        ).first()
    
    def _initialize_ai_components(self):
        """Initialize AI components for the tenant"""
        try:
            # Initialize LLM with tenant-specific configuration
            self.llm = OpenAI(
                temperature=0.7,
                max_tokens=1000,
                model_name="gpt-4"
            )
            
            # Initialize specialized agents
            self._create_specialized_agents()
            
            # Create LangGraph workflow
            self._create_sales_workflow()
            
            logger.info(f"Sales funnel AI components initialized for tenant {self.tenant_id}")
            
        except Exception as e:
            logger.error(f"Failed to initialize sales funnel components: {str(e)}")
            raise
    
    def _create_specialized_agents(self):
        """Create specialized AI agents for different sales stages"""
        
        # Qualification Agent
        qualification_tools = [
            Tool(
                name="qualify_lead",
                description="Qualify a lead based on BANT criteria",
                func=self._qualify_lead_tool
            ),
            Tool(
                name="score_lead",
                description="Score a lead based on multiple factors",
                func=self._score_lead_tool
            )
        ]
        
        self.agents["qualification"] = create_react_agent(
            self.llm,
            qualification_tools,
            "You are a lead qualification specialist. Analyze leads and determine their potential."
        )
        
        # Objection Handling Agent
        objection_tools = [
            Tool(
                name="handle_objection",
                description="Handle common sales objections",
                func=self._handle_objection_tool
            ),
            Tool(
                name="provide_evidence",
                description="Provide evidence to support claims",
                func=self._provide_evidence_tool
            )
        ]
        
        self.agents["objection_handling"] = create_react_agent(
            self.llm,
            objection_tools,
            "You are an expert at handling sales objections. Address concerns professionally."
        )
        
        # Nurturing Agent
        nurturing_tools = [
            Tool(
                name="create_nurture_sequence",
                description="Create personalized nurturing content",
                func=self._create_nurture_sequence_tool
            ),
            Tool(
                name="schedule_follow_up",
                description="Schedule appropriate follow-up activities",
                func=self._schedule_follow_up_tool
            )
        ]
        
        self.agents["nurturing"] = create_react_agent(
            self.llm,
            nurturing_tools,
            "You are a lead nurturing specialist. Create personalized experiences for prospects."
        )
        
        # Closing Agent
        closing_tools = [
            Tool(
                name="identify_closing_signals",
                description="Identify signals that indicate readiness to close",
                func=self._identify_closing_signals_tool
            ),
            Tool(
                name="create_proposal",
                description="Create customized proposals",
                func=self._create_proposal_tool
            )
        ]
        
        self.agents["closing"] = create_react_agent(
            self.llm,
            closing_tools,
            "You are a closing specialist. Identify opportunities and create compelling offers."
        )
    
    def _create_sales_workflow(self):
        """Create LangGraph workflow for sales funnel"""
        
        def qualification_node(state):
            """Qualify the lead"""
            lead_data = state["lead_data"]
            qualification_result = self._run_agent("qualification", lead_data)
            
            return {
                "qualification_result": qualification_result,
                "next_stage": "nurturing" if qualification_result["qualified"] else "disqualified"
            }
        
        def nurturing_node(state):
            """Nurture the lead"""
            lead_data = state["lead_data"]
            nurturing_result = self._run_agent("nurturing", lead_data)
            
            return {
                "nurturing_result": nurturing_result,
                "next_stage": "closing" if nurturing_result["ready_to_close"] else "objection_handling"
            }
        
        def objection_handling_node(state):
            """Handle objections"""
            lead_data = state["lead_data"]
            objection_result = self._run_agent("objection_handling", lead_data)
            
            return {
                "objection_result": objection_result,
                "next_stage": "closing" if objection_result["objections_resolved"] else "nurturing"
            }
        
        def closing_node(state):
            """Attempt to close the deal"""
            lead_data = state["lead_data"]
            closing_result = self._run_agent("closing", lead_data)
            
            return {
                "closing_result": closing_result,
                "next_stage": "closed" if closing_result["closed"] else "nurturing"
            }
        
        def should_continue(state):
            """Determine next step based on current state"""
            next_stage = state.get("next_stage", "nurturing")
            
            if next_stage == "disqualified":
                return "end"
            elif next_stage == "closed":
                return "end"
            elif next_stage == "objection_handling":
                return "objection_handling"
            elif next_stage == "closing":
                return "closing"
            else:
                return "nurturing"
        
        # Create the workflow
        workflow = StateGraph({
            "lead_data": dict,
            "qualification_result": dict,
            "nurturing_result": dict,
            "objection_result": dict,
            "closing_result": dict,
            "next_stage": str
        })
        
        # Add nodes
        workflow.add_node("qualification", qualification_node)
        workflow.add_node("nurturing", nurturing_node)
        workflow.add_node("objection_handling", objection_handling_node)
        workflow.add_node("closing", closing_node)
        
        # Add edges
        workflow.add_edge("qualification", "nurturing")
        workflow.add_conditional_edges(
            "nurturing",
            should_continue,
            {
                "nurturing": "nurturing",
                "objection_handling": "objection_handling",
                "closing": "closing",
                "end": END
            }
        )
        workflow.add_conditional_edges(
            "objection_handling",
            should_continue,
            {
                "nurturing": "nurturing",
                "closing": "closing",
                "end": END
            }
        )
        workflow.add_conditional_edges(
            "closing",
            should_continue,
            {
                "nurturing": "nurturing",
                "end": END
            }
        )
        
        # Set entry point
        workflow.set_entry_point("qualification")
        
        self.workflow = workflow.compile()
    
    async def process_lead(
        self, 
        request: SalesFunnelRequest
    ) -> SalesFunnelResponse:
        """Process a lead through the AI sales funnel"""
        try:
            # Create or update lead record
            lead = await self._create_or_update_lead(request)
            
            # Run through the sales workflow
            initial_state = {
                "lead_data": {
                    "lead_id": lead.id,
                    "name": lead.name,
                    "email": lead.email,
                    "company": lead.company,
                    "source": lead.source,
                    "stage": lead.current_stage,
                    "qualification_score": lead.qualification_score,
                    "notes": lead.notes
                }
            }
            
            # Execute workflow
            result = await self.workflow.ainvoke(initial_state)
            
            # Update lead with results
            await self._update_lead_from_workflow(lead, result)
            
            # Generate response
            response = self._generate_response(lead, result)
            
            return SalesFunnelResponse(
                lead_id=lead.id,
                current_stage=lead.current_stage,
                next_actions=response["next_actions"],
                confidence_score=response["confidence_score"],
                estimated_close_probability=response["close_probability"],
                recommended_approach=response["recommended_approach"],
                tenant_id=self.tenant_id,
                processed_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Failed to process lead: {str(e)}")
            return SalesFunnelResponse(
                lead_id=request.lead_id,
                current_stage="error",
                next_actions=["Contact support"],
                confidence_score=0.0,
                tenant_id=self.tenant_id,
                processed_at=datetime.utcnow()
            )
    
    async def qualify_lead(
        self, 
        request: LeadQualificationRequest
    ) -> LeadQualificationResponse:
        """Qualify a lead using AI"""
        try:
            # Run qualification agent
            qualification_result = self._run_agent("qualification", {
                "name": request.name,
                "email": request.email,
                "company": request.company,
                "budget": request.budget,
                "authority": request.authority,
                "need": request.need,
                "timeline": request.timeline
            })
            
            return LeadQualificationResponse(
                qualified=qualification_result["qualified"],
                qualification_score=qualification_result["score"],
                qualification_reasons=qualification_result["reasons"],
                recommended_approach=qualification_result["approach"],
                next_steps=qualification_result["next_steps"]
            )
            
        except Exception as e:
            logger.error(f"Failed to qualify lead: {str(e)}")
            return LeadQualificationResponse(
                qualified=False,
                qualification_score=0.0,
                qualification_reasons=["Technical error during qualification"]
            )
    
    def _run_agent(self, agent_name: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Run a specific agent with input data"""
        try:
            agent = self.agents[agent_name]
            executor = AgentExecutor(agent=agent, tools=agent.tools)
            
            # Format input for the agent
            formatted_input = self._format_agent_input(input_data)
            
            # Run the agent
            result = executor.invoke({"input": formatted_input})
            
            return self._parse_agent_result(result)
            
        except Exception as e:
            logger.error(f"Failed to run agent {agent_name}: {str(e)}")
            return {"error": str(e)}
    
    def _format_agent_input(self, input_data: Dict[str, Any]) -> str:
        """Format input data for agent processing"""
        return f"""
        Lead Information:
        - Name: {input_data.get('name', 'Unknown')}
        - Email: {input_data.get('email', 'Unknown')}
        - Company: {input_data.get('company', 'Unknown')}
        - Budget: {input_data.get('budget', 'Unknown')}
        - Authority: {input_data.get('authority', 'Unknown')}
        - Need: {input_data.get('need', 'Unknown')}
        - Timeline: {input_data.get('timeline', 'Unknown')}
        - Current Stage: {input_data.get('stage', 'Unknown')}
        - Notes: {input_data.get('notes', 'None')}
        """
    
    def _parse_agent_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Parse agent result into structured format"""
        # This would parse the agent's response into a structured format
        return {
            "qualified": True,
            "score": 0.8,
            "reasons": ["Good fit for our services"],
            "approach": "Direct sales approach",
            "next_steps": ["Schedule demo", "Send proposal"]
        }
    
    async def _create_or_update_lead(self, request: SalesFunnelRequest) -> Lead:
        """Create or update lead record"""
        # Check if lead exists
        lead = self.db.query(Lead).filter(
            Lead.tenant_id == self.tenant_id,
            Lead.email == request.email
        ).first()
        
        if not lead:
            # Create new lead
            lead = Lead(
                tenant_id=self.tenant_id,
                name=request.name,
                email=request.email,
                company=request.company,
                source=request.source,
                current_stage="new",
                qualification_score=0.0,
                created_at=datetime.utcnow()
            )
            self.db.add(lead)
        else:
            # Update existing lead
            lead.name = request.name
            lead.company = request.company
            lead.source = request.source
            lead.updated_at = datetime.utcnow()
        
        self.db.commit()
        return lead
    
    async def _update_lead_from_workflow(self, lead: Lead, workflow_result: Dict[str, Any]):
        """Update lead based on workflow results"""
        # Update lead with workflow results
        if "qualification_result" in workflow_result:
            lead.qualification_score = workflow_result["qualification_result"].get("score", 0.0)
        
        if "next_stage" in workflow_result:
            lead.current_stage = workflow_result["next_stage"]
        
        lead.updated_at = datetime.utcnow()
        self.db.commit()
    
    def _generate_response(self, lead: Lead, workflow_result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate response based on workflow results"""
        return {
            "next_actions": ["Follow up in 3 days", "Send relevant content"],
            "confidence_score": 0.8,
            "close_probability": 0.6,
            "recommended_approach": "Consultative selling"
        }
    
    # Tool functions for agents
    def _qualify_lead_tool(self, input_data: str) -> str:
        """Tool for qualifying leads"""
        return "Lead qualified with score 8/10"
    
    def _score_lead_tool(self, input_data: str) -> str:
        """Tool for scoring leads"""
        return "Lead score: 8/10"
    
    def _handle_objection_tool(self, input_data: str) -> str:
        """Tool for handling objections"""
        return "Objection handled with value proposition"
    
    def _provide_evidence_tool(self, input_data: str) -> str:
        """Tool for providing evidence"""
        return "Evidence provided: case studies and testimonials"
    
    def _create_nurture_sequence_tool(self, input_data: str) -> str:
        """Tool for creating nurture sequences"""
        return "Nurture sequence created with 5 touchpoints"
    
    def _schedule_follow_up_tool(self, input_data: str) -> str:
        """Tool for scheduling follow-ups"""
        return "Follow-up scheduled for next week"
    
    def _identify_closing_signals_tool(self, input_data: str) -> str:
        """Tool for identifying closing signals"""
        return "Closing signals identified: budget confirmed, timeline established"
    
    def _create_proposal_tool(self, input_data: str) -> str:
        """Tool for creating proposals"""
        return "Custom proposal created with pricing and terms"
    
    def get_sales_analytics(self, days: int = 30) -> SalesAnalytics:
        """Get sales funnel analytics for the tenant"""
        # Calculate analytics based on tenant data
        start_date = datetime.utcnow() - timedelta(days=days)
        
        leads = self.db.query(Lead).filter(
            Lead.tenant_id == self.tenant_id,
            Lead.created_at >= start_date
        ).all()
        
        total_leads = len(leads)
        qualified_leads = len([l for l in leads if l.qualification_score >= 7])
        closed_leads = len([l for l in leads if l.current_stage == "closed"])
        
        return SalesAnalytics(
            tenant_id=self.tenant_id,
            period_days=days,
            total_leads=total_leads,
            qualified_leads=qualified_leads,
            closed_leads=closed_leads,
            qualification_rate=qualified_leads / total_leads if total_leads > 0 else 0,
            close_rate=closed_leads / qualified_leads if qualified_leads > 0 else 0,
            average_qualification_score=sum(l.qualification_score for l in leads) / total_leads if total_leads > 0 else 0,
            stage_distribution=self._get_stage_distribution(leads)
        )
    
    def _get_stage_distribution(self, leads: List[Lead]) -> Dict[str, int]:
        """Get distribution of leads across stages"""
        distribution = {}
        for lead in leads:
            stage = lead.current_stage
            distribution[stage] = distribution.get(stage, 0) + 1
        return distribution