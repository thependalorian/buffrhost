-- Enhanced AI Agent Knowledge Base with Marketing Intelligence
-- Based on Harvard Business School frameworks and marketing strategy

-- Strategic Frameworks Knowledge
CREATE TABLE IF NOT EXISTS strategic_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_name VARCHAR(100) NOT NULL UNIQUE,
    framework_type VARCHAR(50) NOT NULL, -- 'marketing', 'financial', 'operational', 'strategic'
    description TEXT NOT NULL,
    key_concepts JSONB NOT NULL,
    application_guidelines TEXT,
    success_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Value Analysis Knowledge
CREATE TABLE IF NOT EXISTS customer_value_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value_type VARCHAR(50) NOT NULL, -- 'economic', 'functional', 'experiential', 'social'
    analysis_method VARCHAR(100) NOT NULL,
    calculation_formula TEXT,
    application_context TEXT,
    examples JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Math Knowledge
CREATE TABLE IF NOT EXISTS marketing_math_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_name VARCHAR(100) NOT NULL UNIQUE,
    concept_type VARCHAR(50) NOT NULL, -- 'pricing', 'promotion', 'channel', 'lifetime_value'
    formula TEXT NOT NULL,
    variables JSONB NOT NULL,
    business_application TEXT,
    calculation_examples JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Analysis Knowledge
CREATE TABLE IF NOT EXISTS market_analysis_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    method_name VARCHAR(100) NOT NULL UNIQUE,
    analysis_type VARCHAR(50) NOT NULL, -- 'market_size', 'customer_segmentation', 'competitive', 'pricing'
    methodology TEXT NOT NULL,
    data_requirements JSONB NOT NULL,
    output_metrics JSONB NOT NULL,
    best_practices TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Strategic Frameworks
INSERT INTO strategic_frameworks (framework_name, framework_type, description, key_concepts, application_guidelines) VALUES
('Economic Value to Customer (EVC)', 'marketing', 'Framework for calculating the maximum price customers will pay based on total cost of ownership', 
'{"total_cost_ownership": "Purchase price + setup + operations + maintenance + disposal", "reference_product": "Current product being replaced", "economic_benefits": "Savings from new product", "maximum_price": "EVC = Reference product cost + Economic benefits"}',
'Use for B2B pricing decisions, product positioning, and competitive analysis. Calculate life cycle costs and quantify economic benefits.'),

('Service-Profit Chain', 'operational', 'Framework linking employee satisfaction to customer satisfaction and profitability',
'{"employee_satisfaction": "Foundation for service quality", "customer_satisfaction": "Result of employee performance", "customer_loyalty": "Outcome of satisfaction", "profitability": "Result of loyalty and retention"}',
'Focus on employee satisfaction first, then customer experience, then profitability. Measure at each stage.'),

('Multi-Attribute Model', 'marketing', 'Framework for evaluating products based on weighted attributes',
'{"attributes": "Key product features", "importance_weights": "Customer preferences", "performance_ratings": "Product scores", "overall_preference": "Weighted sum of ratings"}',
'Use for product positioning, competitive analysis, and feature prioritization. Survey customers for weights.'),

('Low-Tech Marketing Math', 'financial', 'Simple calculations for marketing decision making',
'{"unit_margin": "Price - Variable cost", "break_even_volume": "Fixed costs / Unit margin", "market_share": "Awareness × Trial × Repeat", "price_elasticity": "Volume change / Price change"}',
'Use for quick analysis of pricing, promotion, and market decisions. Focus on contribution margin.'),

('Marketing Strategy Framework', 'strategic', 'Comprehensive framework for marketing strategy formation',
'{"customer_analysis": "Needs, segments, behavior", "company_analysis": "Capabilities, resources", "collaborator_analysis": "Partners, channels", "competitive_analysis": "Positioning, advantages", "context_analysis": "Market trends, environment"}',
'Use for comprehensive marketing strategy development. Analyze all five areas before making decisions.');

-- Insert Customer Value Analysis Methods
INSERT INTO customer_value_analysis (value_type, analysis_method, calculation_formula, application_context, examples) VALUES
('economic', 'Total Cost of Ownership', 'TCO = Purchase Price + Setup + Operations + Maintenance + Disposal', 'B2B products with long-term usage', '{"led_bulbs": "Higher upfront cost but lower energy usage", "software": "Licensing vs operational savings"}'),
('functional', 'Multi-Attribute Analysis', 'Preference = Σ(Importance × Performance)', 'Products with multiple features', '{"laptops": "Storage, RAM, weight, price", "cars": "Fuel efficiency, safety, features"}'),
('experiential', 'Brand Equity Assessment', 'Brand Value = Awareness × Perceived Quality × Brand Associations', 'Consumer products and services', '{"apple": "Design, innovation, status", "starbucks": "Experience, community, quality"}'),
('social', 'Network Effects Analysis', 'Value = f(Number of Users, Interaction Quality, Content Value)', 'Platform and social products', '{"facebook": "Social connections", "whatsapp": "Communication network"}');

-- Insert Marketing Math Concepts
INSERT INTO marketing_math_concepts (concept_name, concept_type, formula, variables, business_application, calculation_examples) VALUES
('Unit Margin', 'pricing', 'Unit Margin = Price - Variable Cost', '{"price": "Selling price per unit", "variable_cost": "Cost per unit"}', 'Determine profitability per unit sold', '{"example": "Price $100, Variable Cost $60, Margin $40"}'),
('Break-Even Volume', 'pricing', 'BEV = Fixed Costs / Unit Margin', '{"fixed_costs": "Total fixed costs", "unit_margin": "Margin per unit"}', 'Calculate minimum sales needed to cover costs', '{"example": "Fixed $100k, Margin $40, BEV 2,500 units"}'),
('Customer Lifetime Value', 'lifetime_value', 'LTV = (Annual Margin × Retention Rate) / (1 - Retention Rate + Discount Rate)', '{"annual_margin": "Profit per customer per year", "retention_rate": "Percentage staying each year", "discount_rate": "Cost of capital"}', 'Value of acquiring a customer', '{"example": "Margin $100, Retention 80%, Discount 10%, LTV $400"}'),
('Price Elasticity', 'pricing', 'Elasticity = (% Change in Quantity) / (% Change in Price)', '{"quantity_change": "Percentage change in sales", "price_change": "Percentage change in price"}', 'Measure price sensitivity', '{"example": "Price -10%, Sales +20%, Elasticity -2.0"}'),
('Market Share', 'market_analysis', 'Market Share = Awareness × Trial × Repeat', '{"awareness": "Percentage aware of brand", "trial": "Percentage who tried", "repeat": "Percentage who repeat purchase"}', 'Understand market share drivers', '{"example": "80% aware, 40% trial, 20% repeat = 6.4% share"}'),
('Return on Ad Spend', 'promotion', 'ROAS = Revenue from Ads / Ad Spend', '{"revenue": "Revenue generated", "ad_spend": "Amount spent on advertising"}', 'Measure advertising effectiveness', '{"example": "$50k revenue, $15k spend, ROAS 3.33"}'),
('Customer Acquisition Cost', 'promotion', 'CAC = Total Acquisition Cost / New Customers', '{"acquisition_cost": "Total marketing spend", "new_customers": "Number of new customers"}', 'Cost to acquire each customer', '{"example": "$15k spend, 200 customers, CAC $75"}');

-- Insert Market Analysis Methods
INSERT INTO market_analysis_methods (method_name, analysis_type, methodology, data_requirements, output_metrics, best_practices) VALUES
('Top-Down Market Sizing', 'market_size', 'Use industry data to estimate total addressable market', '{"industry_reports": "Published market data", "competitor_analysis": "Existing market players", "growth_rates": "Historical and projected growth"}', '{"tam": "Total addressable market", "sam": "Serviceable addressable market", "som": "Serviceable obtainable market"}', 'Start with broad market, narrow to target segments'),
('Bottom-Up Market Sizing', 'market_size', 'Build market size from customer segments and usage patterns', '{"customer_segments": "Target customer groups", "usage_patterns": "How customers use product", "pricing_data": "Price points and willingness to pay"}', '{"market_size": "Total market value", "segment_sizes": "Size of each segment", "growth_potential": "Future market growth"}', 'More detailed but requires more data'),
('Customer Segmentation', 'customer_segmentation', 'Group customers by needs, behaviors, and characteristics', '{"demographics": "Age, income, location", "psychographics": "Values, lifestyle, interests", "behavioral": "Purchase patterns, usage", "needs": "Pain points, desires"}', '{"segments": "Customer groups", "segment_sizes": "Size of each segment", "segment_profiles": "Characteristics of each segment"}', 'Use multiple criteria, validate with data'),
('Competitive Analysis', 'competitive', 'Analyze competitors strengths, weaknesses, and positioning', '{"competitor_products": "Product features and benefits", "pricing": "Competitor pricing strategies", "market_share": "Competitor market positions", "strengths_weaknesses": "Competitive advantages and disadvantages"}', '{"competitive_map": "Positioning of all players", "gaps": "Market opportunities", "threats": "Competitive risks"}', 'Focus on differentiation and positioning'),
('Pricing Analysis', 'pricing', 'Determine optimal pricing strategy based on value and competition', '{"cost_structure": "Fixed and variable costs", "value_proposition": "Customer value delivered", "competitor_pricing": "Competitive price points", "price_elasticity": "Customer price sensitivity"}', '{"optimal_price": "Recommended price point", "price_elasticity": "Price sensitivity measure", "profit_impact": "Expected profit impact"}', 'Test pricing with experiments when possible');
