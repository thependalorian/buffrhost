"""
Buffr Host Agent CLI
Command-line interface for interacting with the Buffr Host agent
"""

import asyncio
import sys
import json
from datetime import datetime
from typing import Optional, Dict, Any
import click
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.prompt import Prompt, Confirm
from rich.syntax import Syntax

from ai.agent.graph import create_buffr_graph
from ai.agent.agent import create_buffr_agent
from database import get_neon_client


console = Console()


class BuffrCLI:
    """CLI interface for Buffr Host agent"""
    
    def __init__(self):
        self.console = Console()
        self.neon_client = None
        self.agent_graph = None
        self.tenant_id = None
        self.property_id = None
        self.user_id = None
        self.session_id = None
    
    async def initialize(self, tenant_id: str, property_id: int, user_id: str = "cli_user"):
        """Initialize CLI with agent"""
        try:
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=self.console
            ) as progress:
                task = progress.add_task("Initializing Buffr Host Agent...", total=None)
                
                # Get database client
                self.neon_client = get_neon_client()
                self.tenant_id = tenant_id
                self.property_id = property_id
                self.user_id = user_id
                self.session_id = f"cli_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                
                # Create agent graph
                self.agent_graph = create_buffr_graph(self.neon_client, tenant_id, property_id)
                
                progress.update(task, description="✅ Agent initialized successfully")
                
        except Exception as e:
            self.console.print(f"[red]Error initializing agent: {e}[/red]")
            sys.exit(1)
    
    async def chat_loop(self):
        """Interactive chat loop"""
        self.console.print(Panel.fit(
            "[bold blue]Buffr Host Agent CLI[/bold blue]\n"
            f"Property ID: {self.property_id}\n"
            f"Tenant ID: {self.tenant_id}\n"
            f"Session: {self.session_id}",
            title="🤖 Welcome to Buffr Host Agent",
            border_style="blue"
        ))
        
        self.console.print("\n[yellow]Type your message and press Enter. Type 'quit' to exit.[/yellow]\n")
        
        while True:
            try:
                # Get user input
                message = Prompt.ask("[bold green]You[/bold green]")
                
                if message.lower() in ['quit', 'exit', 'bye']:
                    self.console.print("\n[blue]Goodbye! 👋[/blue]")
                    break
                
                if not message.strip():
                    continue
                
                # Show typing indicator
                with Progress(
                    SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    console=self.console
                ) as progress:
                    task = progress.add_task("Sofia is thinking...", total=None)
                    
                    # Get agent response
                    result = await self.agent_graph.run(
                        message=message,
                        user_id=self.user_id,
                        session_id=self.session_id
                    )
                    
                    progress.update(task, description="✅ Response ready")
                
                # Display response
                self._display_response(result)
                
            except KeyboardInterrupt:
                self.console.print("\n[yellow]Chat interrupted. Type 'quit' to exit.[/yellow]")
                continue
            except Exception as e:
                self.console.print(f"[red]Error: {e}[/red]")
                continue
    
    def _display_response(self, result: Dict[str, Any]):
        """Display agent response with formatting"""
        response = result.get("response", "No response")
        confidence = result.get("confidence_score", 0.0)
        intent = result.get("intent", "unknown")
        personality = result.get("personality", {})
        
        # Create response panel
        response_text = Text(response, style="white")
        
        # Add personality context
        if personality:
            mood = personality.get("current_mood", "professional")
            style = personality.get("communication_style", "professional and attentive")
            
            # Color code based on mood
            if mood == "empathetic":
                response_text.style = "italic cyan"
            elif mood == "positive":
                response_text.style = "bold green"
            elif mood == "focused":
                response_text.style = "yellow"
            else:
                response_text.style = "white"
        
        # Create panel
        panel = Panel(
            response_text,
            title=f"[bold blue]Sofia[/bold blue] (Confidence: {confidence:.1%})",
            subtitle=f"Intent: {intent}",
            border_style="blue"
        )
        
        self.console.print(panel)
        
        # Show suggested actions if available
        if result.get("requires_human"):
            self.console.print("[yellow]⚠️  This may require human assistance[/yellow]")
    
    async def show_health(self):
        """Show agent health status"""
        try:
            health = await self.agent_graph.get_health_status()
            
            # Create health table
            table = Table(title="🤖 Agent Health Status")
            table.add_column("Metric", style="cyan")
            table.add_column("Status", style="green")
            
            table.add_row("Overall Status", health.get("status", "unknown"))
            table.add_row("Personality Loaded", "✅" if health.get("personality_loaded") else "❌")
            table.add_row("Property Context", "✅" if health.get("property_context_loaded") else "❌")
            table.add_row("Memory Service", "✅" if health.get("memory_service_available") else "❌")
            table.add_row("Success Rate", f"{health.get('success_rate', 0):.1%}")
            table.add_row("Error Count", str(health.get("error_count", 0)))
            
            self.console.print(table)
            
        except Exception as e:
            self.console.print(f"[red]Error getting health status: {e}[/red]")
    
    async def show_personality(self):
        """Show personality analytics"""
        try:
            analytics = await self.agent_graph.get_personality_analytics()
            
            personality = analytics.get("personality_summary", {})
            analytics_data = analytics.get("analytics", {})
            
            # Create personality panel
            personality_text = f"""
[bold]Name:[/bold] {personality.get('name', 'Sofia')}
[bold]Role:[/bold] {personality.get('role', 'Professional Concierge')}
[bold]Mood:[/bold] {personality.get('mood', 'professional')}
[bold]Confidence:[/bold] {personality.get('confidence', 0):.1%}
[bold]Energy:[/bold] {personality.get('energy', 0):.1%}
[bold]Communication Style:[/bold] {personality.get('communication_style', 'professional')}
            """
            
            self.console.print(Panel(
                personality_text,
                title="🧠 Personality Profile",
                border_style="magenta"
            ))
            
            # Show analytics
            if analytics_data:
                table = Table(title="📊 Performance Analytics")
                table.add_column("Metric", style="cyan")
                table.add_column("Value", style="green")
                
                table.add_row("Overall Success Rate", f"{analytics_data.get('overall_success_rate', 0):.1%}")
                table.add_row("Recent Success Rate", f"{analytics_data.get('recent_success_rate', 0):.1%}")
                table.add_row("Total Interactions", str(analytics_data.get('total_interactions', 0)))
                table.add_row("EM Iterations", str(analytics_data.get('em_iterations', 0)))
                
                self.console.print(table)
            
        except Exception as e:
            self.console.print(f"[red]Error getting personality analytics: {e}[/red]")
    
    async def test_booking(self):
        """Test booking functionality"""
        self.console.print("[yellow]Testing booking functionality...[/yellow]")
        
        # Create test booking
        test_message = "I'd like to book a spa treatment for tomorrow at 2 PM for Sarah Johnson"
        
        try:
            result = await self.agent_graph.run(
                message=test_message,
                user_id=self.user_id,
                session_id=self.session_id
            )
            
            self.console.print(f"[green]Booking test response:[/green] {result['response']}")
            
        except Exception as e:
            self.console.print(f"[red]Booking test error: {e}[/red]")
    
    async def test_order(self):
        """Test restaurant ordering functionality"""
        self.console.print("[yellow]Testing restaurant ordering...[/yellow]")
        
        # Create test order
        test_message = "I'd like to order the Wagyu Beef Tenderloin and Chocolate Lava Cake for table 5"
        
        try:
            result = await self.agent_graph.run(
                message=test_message,
                user_id=self.user_id,
                session_id=self.session_id
            )
            
            self.console.print(f"[green]Order test response:[/green] {result['response']}")
            
        except Exception as e:
            self.console.print(f"[red]Order test error: {e}[/red]")


@click.group()
def cli():
    """Buffr Host Agent CLI"""
    pass


@cli.command()
@click.option('--tenant-id', required=True, help='Tenant ID')
@click.option('--property-id', required=True, type=int, help='Property ID')
@click.option('--user-id', default='cli_user', help='User ID for session')
def chat(tenant_id: str, property_id: int, user_id: str):
    """Start interactive chat with agent"""
    async def run_chat():
        cli_instance = BuffrCLI()
        await cli_instance.initialize(tenant_id, property_id, user_id)
        await cli_instance.chat_loop()
    
    asyncio.run(run_chat())


@cli.command()
@click.option('--tenant-id', required=True, help='Tenant ID')
@click.option('--property-id', required=True, type=int, help='Property ID')
def health(tenant_id: str, property_id: int):
    """Show agent health status"""
    async def run_health():
        cli_instance = BuffrCLI()
        await cli_instance.initialize(tenant_id, property_id)
        await cli_instance.show_health()
    
    asyncio.run(run_health())


@cli.command()
@click.option('--tenant-id', required=True, help='Tenant ID')
@click.option('--property-id', required=True, type=int, help='Property ID')
def personality(tenant_id: str, property_id: int):
    """Show personality analytics"""
    async def run_personality():
        cli_instance = BuffrCLI()
        await cli_instance.initialize(tenant_id, property_id)
        await cli_instance.show_personality()
    
    asyncio.run(run_personality())


@cli.command()
@click.option('--tenant-id', required=True, help='Tenant ID')
@click.option('--property-id', required=True, type=int, help='Property ID')
def test(tenant_id: str, property_id: int):
    """Run agent tests"""
    async def run_tests():
        cli_instance = BuffrCLI()
        await cli_instance.initialize(tenant_id, property_id)
        
        console.print("[bold blue]Running Agent Tests[/bold blue]\n")
        
        await cli_instance.test_booking()
        console.print()
        await cli_instance.test_order()
        console.print()
        await cli_instance.show_health()
    
    asyncio.run(run_tests())


@cli.command()
@click.option('--message', required=True, help='Message to send to agent')
@click.option('--tenant-id', required=True, help='Tenant ID')
@click.option('--property-id', required=True, type=int, help='Property ID')
@click.option('--user-id', default='cli_user', help='User ID for session')
def send(message: str, tenant_id: str, property_id: int, user_id: str):
    """Send a single message to agent"""
    async def run_send():
        cli_instance = BuffrCLI()
        await cli_instance.initialize(tenant_id, property_id, user_id)
        
        result = await cli_instance.agent_graph.run(
            message=message,
            user_id=user_id,
            session_id=cli_instance.session_id
        )
        
        cli_instance._display_response(result)
    
    asyncio.run(run_send())


if __name__ == "__main__":
    cli()
