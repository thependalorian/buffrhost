"""
Digital Initials Manager Service
Handles digital initials generation and management
"""

import logging
import re
from typing import Dict, List, Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class DigitalInitialsManager:
    """Manages digital initials generation and customization"""
    
    def __init__(self):
        self.initials_styles = {
            "formal": self._generate_formal_initials,
            "cursive": self._generate_cursive_initials,
            "block": self._generate_block_initials,
            "signature_style": self._generate_signature_style_initials
        }
    
    async def create_initials(
        self, 
        user_id: str, 
        name: str, 
        preferred_style: str = "formal"
    ) -> Dict[str, Any]:
        """Create digital initials for a user"""
        try:
            logger.info(f"Creating digital initials for user {user_id}")
            
            # Extract initials from name
            initials = self._extract_initials(name)
            
            # Generate initials in preferred style
            if preferred_style not in self.initials_styles:
                preferred_style = "formal"
            
            initials_data = self.initials_styles[preferred_style](initials)
            
            # Add accessibility options
            accessibility_options = self._generate_accessibility_options(initials)
            initials_data.update(accessibility_options)
            
            # Add validation rules
            validation_rules = self._get_validation_rules(initials)
            initials_data.update(validation_rules)
            
            # Create response
            response = {
                "id": f"initials_{user_id}_{int(datetime.utcnow().timestamp())}",
                "user_id": user_id,
                "initials": initials,
                "style": preferred_style,
                "initials_data": initials_data,
                "created_at": datetime.utcnow().isoformat(),
                "metadata": {
                    "original_name": name,
                    "generation_method": "ai_generated",
                    "version": "1.0"
                }
            }
            
            logger.info(f"Digital initials created successfully for user {user_id}")
            return response
            
        except Exception as e:
            logger.error(f"Failed to create digital initials for user {user_id}: {e}")
            raise
    
    def _extract_initials(self, name: str) -> str:
        """Extract initials from a name"""
        try:
            # Clean and split the name
            name_parts = re.findall(r'\b[A-Za-z]+\b', name.strip())
            
            if not name_parts:
                return "XX"  # Default fallback
            
            # Extract first letter of each word
            initials = ''.join([part[0].upper() for part in name_parts])
            
            # Limit to 3 initials maximum
            if len(initials) > 3:
                initials = initials[:3]
            
            return initials
            
        except Exception as e:
            logger.error(f"Failed to extract initials from name '{name}': {e}")
            return "XX"
    
    def _generate_formal_initials(self, initials: str) -> Dict[str, Any]:
        """Generate formal style initials"""
        return {
            "style_type": "formal",
            "font_family": "Times New Roman, serif",
            "font_weight": "bold",
            "font_size": "24px",
            "color": "#000000",
            "background": "transparent",
            "border": "2px solid #000000",
            "border_radius": "4px",
            "padding": "8px 12px",
            "text_align": "center",
            "letter_spacing": "2px",
            "line_height": "1.2",
            "svg_path": self._generate_svg_path(initials, "formal"),
            "canvas_data": self._generate_canvas_data(initials, "formal")
        }
    
    def _generate_cursive_initials(self, initials: str) -> Dict[str, Any]:
        """Generate cursive style initials"""
        return {
            "style_type": "cursive",
            "font_family": "Brush Script MT, cursive",
            "font_weight": "normal",
            "font_size": "28px",
            "color": "#1a1a1a",
            "background": "transparent",
            "border": "none",
            "border_radius": "0px",
            "padding": "4px 8px",
            "text_align": "center",
            "letter_spacing": "1px",
            "line_height": "1.1",
            "font_style": "italic",
            "svg_path": self._generate_svg_path(initials, "cursive"),
            "canvas_data": self._generate_canvas_data(initials, "cursive")
        }
    
    def _generate_block_initials(self, initials: str) -> Dict[str, Any]:
        """Generate block style initials"""
        return {
            "style_type": "block",
            "font_family": "Arial, sans-serif",
            "font_weight": "900",
            "font_size": "26px",
            "color": "#ffffff",
            "background": "#000000",
            "border": "3px solid #000000",
            "border_radius": "8px",
            "padding": "10px 14px",
            "text_align": "center",
            "letter_spacing": "3px",
            "line_height": "1.0",
            "text_transform": "uppercase",
            "svg_path": self._generate_svg_path(initials, "block"),
            "canvas_data": self._generate_canvas_data(initials, "block")
        }
    
    def _generate_signature_style_initials(self, initials: str) -> Dict[str, Any]:
        """Generate signature-style initials"""
        return {
            "style_type": "signature_style",
            "font_family": "Lucida Handwriting, cursive",
            "font_weight": "normal",
            "font_size": "30px",
            "color": "#2c2c2c",
            "background": "transparent",
            "border": "1px dashed #666666",
            "border_radius": "2px",
            "padding": "6px 10px",
            "text_align": "center",
            "letter_spacing": "4px",
            "line_height": "1.0",
            "font_style": "italic",
            "text_decoration": "underline",
            "svg_path": self._generate_svg_path(initials, "signature_style"),
            "canvas_data": self._generate_canvas_data(initials, "signature_style")
        }
    
    def _generate_svg_path(self, initials: str, style: str) -> str:
        """Generate SVG path for initials (placeholder implementation)"""
        # This is a placeholder implementation
        # In a real implementation, you would generate actual SVG paths
        # based on the initials and style
        
        if style == "formal":
            return f"M 10 20 L 30 20 L 30 40 L 10 40 Z"  # Rectangle
        elif style == "cursive":
            return f"M 5 25 Q 20 10 35 25 Q 20 40 5 25"  # Curved
        elif style == "block":
            return f"M 8 15 L 32 15 L 32 35 L 8 35 Z"  # Bold rectangle
        else:  # signature_style
            return f"M 5 20 Q 15 10 25 20 Q 15 30 5 20"  # Signature curve
    
    def _generate_canvas_data(self, initials: str, style: str) -> str:
        """Generate canvas drawing data for initials (placeholder implementation)"""
        # This is a placeholder implementation
        # In a real implementation, you would generate actual canvas drawing commands
        
        canvas_commands = {
            "formal": f"ctx.font='bold 24px Times New Roman'; ctx.fillText('{initials}', 10, 25);",
            "cursive": f"ctx.font='italic 28px Brush Script MT'; ctx.fillText('{initials}', 8, 28);",
            "block": f"ctx.font='900 26px Arial'; ctx.fillStyle='#000000'; ctx.fillRect(8, 15, 24, 20); ctx.fillStyle='#ffffff'; ctx.fillText('{initials}', 12, 30);",
            "signature_style": f"ctx.font='italic 30px Lucida Handwriting'; ctx.fillText('{initials}', 5, 30); ctx.strokeStyle='#666666'; ctx.setLineDash([2, 2]); ctx.strokeRect(5, 15, 30, 20);"
        }
        
        return canvas_commands.get(style, canvas_commands["formal"])
    
    def _generate_accessibility_options(self, initials: str) -> Dict[str, Any]:
        """Generate accessibility options for initials"""
        return {
            "alt_text": f"Digital initials: {initials}",
            "aria_label": f"Digital initials field containing {initials}",
            "voice_description": f"Initials: {initials}",
            "screen_reader_text": f"Digital initials field containing {initials}",
            "high_contrast_mode": True,
            "keyboard_navigable": True,
            "focus_indicators": True
        }
    
    def _get_validation_rules(self, initials: str) -> Dict[str, Any]:
        """Get validation rules for initials"""
        escaped_initials = initials.replace('.', r'\.')
        return {
            "min_length": len(initials),
            "max_length": len(initials) + 2,
            "pattern": f"^{escaped_initials}$",
            "required": True,
            "case_sensitive": False,
            "allow_spaces": False,
            "allow_special_chars": False
        }
    
    def _validate_initials(self, initials: str) -> Dict[str, Any]:
        """Validate initials format"""
        validation_result = {
            "is_valid": True,
            "errors": [],
            "warnings": []
        }
        
        # Check length
        if len(initials) < 1:
            validation_result["is_valid"] = False
            validation_result["errors"].append("Initials must be at least 1 character long")
        
        if len(initials) > 5:
            validation_result["is_valid"] = False
            validation_result["errors"].append("Initials must be no more than 5 characters long")
        
        # Check for valid characters
        if not re.match(r'^[A-Za-z]+$', initials):
            validation_result["is_valid"] = False
            validation_result["errors"].append("Initials must contain only letters")
        
        # Check for reasonable length
        if len(initials) > 3:
            validation_result["warnings"].append("Initials longer than 3 characters may be difficult to read")
        
        return validation_result
    
    async def get_available_styles(self) -> List[Dict[str, Any]]:
        """Get available initials styles"""
        return [
            {
                "id": "formal",
                "name": "Formal",
                "description": "Clean, professional style suitable for business documents",
                "preview": "AA"
            },
            {
                "id": "cursive",
                "name": "Cursive",
                "description": "Elegant, flowing style with italic emphasis",
                "preview": "AA"
            },
            {
                "id": "block",
                "name": "Block",
                "description": "Bold, high-contrast style for maximum visibility",
                "preview": "AA"
            },
            {
                "id": "signature_style",
                "name": "Signature Style",
                "description": "Handwritten appearance with dashed border",
                "preview": "AA"
            }
        ]
    
    async def customize_style(self, style_id: str, customizations: Dict[str, Any]) -> Dict[str, Any]:
        """Customize an existing style"""
        try:
            if style_id not in self.initials_styles:
                raise ValueError(f"Unknown style: {style_id}")
            
            # Get base style
            base_style = self.initials_styles[style_id]("XX")  # Use placeholder initials
            
            # Apply customizations
            for key, value in customizations.items():
                if key in base_style:
                    base_style[key] = value
            
            return base_style
            
        except Exception as e:
            logger.error(f"Failed to customize style {style_id}: {e}")
            raise
    
    async def generate_initials_preview(self, initials: str, style_id: str) -> Dict[str, Any]:
        """Generate a preview of initials in a specific style"""
        try:
            if style_id not in self.initials_styles:
                raise ValueError(f"Unknown style: {style_id}")
            
            # Generate initials data
            initials_data = self.initials_styles[style_id](initials)
            
            # Add preview-specific data
            preview_data = {
                "initials": initials,
                "style": style_id,
                "preview_html": f"<div style='font-family: {initials_data['font_family']}; font-size: {initials_data['font_size']}; color: {initials_data['color']};'>{initials}</div>",
                "preview_css": self._generate_preview_css(initials_data),
                "preview_svg": self._generate_preview_svg(initials, initials_data),
                "generated_at": datetime.utcnow().isoformat()
            }
            
            return preview_data
            
        except Exception as e:
            logger.error(f"Failed to generate preview for initials '{initials}' in style '{style_id}': {e}")
            raise
    
    def _generate_preview_css(self, initials_data: Dict[str, Any]) -> str:
        """Generate CSS for initials preview"""
        css_properties = [
            f"font-family: {initials_data.get('font_family', 'Arial')}",
            f"font-size: {initials_data.get('font_size', '24px')}",
            f"font-weight: {initials_data.get('font_weight', 'normal')}",
            f"color: {initials_data.get('color', '#000000')}",
            f"background: {initials_data.get('background', 'transparent')}",
            f"border: {initials_data.get('border', 'none')}",
            f"border-radius: {initials_data.get('border_radius', '0px')}",
            f"padding: {initials_data.get('padding', '0px')}",
            f"text-align: {initials_data.get('text_align', 'left')}",
            f"letter-spacing: {initials_data.get('letter_spacing', 'normal')}",
            f"line-height: {initials_data.get('line_height', 'normal')}"
        ]
        
        return f".initials-preview {{ {'; '.join(css_properties)} }}"
    
    def _generate_preview_svg(self, initials: str, initials_data: Dict[str, Any]) -> str:
        """Generate SVG for initials preview"""
        width = 100
        height = 50
        
        svg_content = f"""
        <svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="{width}" height="{height}" fill="{initials_data.get('background', 'transparent')}" stroke="{initials_data.get('color', '#000000')}" stroke-width="1"/>
            <text x="{width//2}" y="{height//2 + 5}" text-anchor="middle" font-family="{initials_data.get('font_family', 'Arial')}" font-size="{initials_data.get('font_size', '24px')}" fill="{initials_data.get('color', '#000000')}">{initials}</text>
        </svg>
        """
        
        return svg_content.strip()