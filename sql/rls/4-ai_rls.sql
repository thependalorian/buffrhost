-- AI Row Level Security Policies
-- Security policies for AI and knowledge base tables

-- Enable RLS on AI tables
ALTER TABLE KnowledgeBase ENABLE ROW LEVEL SECURITY;
ALTER TABLE AIAgentSession ENABLE ROW LEVEL SECURITY;
ALTER TABLE AIAgentMessage ENABLE ROW LEVEL SECURITY;
ALTER TABLE AIAgentWorkflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE AIAgentExecution ENABLE ROW LEVEL SECURITY;
ALTER TABLE KnowledgeVectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE DocumentProcessingLog ENABLE ROW LEVEL SECURITY;
ALTER TABLE WebCrawlLog ENABLE ROW LEVEL SECURITY;
ALTER TABLE VoiceModels ENABLE ROW LEVEL SECURITY;
ALTER TABLE VoiceInteractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE AudioFiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE SitePages ENABLE ROW LEVEL SECURITY;

-- Knowledge Base Policies
CREATE POLICY "Allow public to view active knowledge base"
  ON KnowledgeBase
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow property staff to manage knowledge base"
  ON KnowledgeBase
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- AI Agent Session Policies
CREATE POLICY "Allow customers to view their own sessions"
  ON AIAgentSession
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to manage sessions"
  ON AIAgentSession
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- AI Agent Message Policies
CREATE POLICY "Allow session participants to view messages"
  ON AIAgentMessage
  FOR SELECT
  TO authenticated
  USING (session_id IN (
    SELECT session_id FROM AIAgentSession 
    WHERE customer_id IN (
      SELECT customer_id FROM BuffrHostUser 
      WHERE owner_id = auth.uid()
    )
  ));

-- AI Agent Workflow Policies
CREATE POLICY "Allow property staff to manage workflows"
  ON AIAgentWorkflow
  FOR ALL
  TO authenticated
  USING (true);

-- Knowledge Vectors Policies
CREATE POLICY "Allow property staff to manage vectors"
  ON KnowledgeVectors
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Document Processing Log Policies
CREATE POLICY "Allow property staff to manage document logs"
  ON DocumentProcessingLog
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Web Crawl Log Policies
CREATE POLICY "Allow property staff to manage crawl logs"
  ON WebCrawlLog
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Voice Models Policies
CREATE POLICY "Allow property staff to manage voice models"
  ON VoiceModels
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Voice Interactions Policies
CREATE POLICY "Allow property staff to manage voice interactions"
  ON VoiceInteractions
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Audio Files Policies
CREATE POLICY "Allow property staff to manage audio files"
  ON AudioFiles
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Site Pages Policies
CREATE POLICY "Allow public to view site pages"
  ON SitePages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow property staff to manage site pages"
  ON SitePages
  FOR ALL
  TO authenticated
  USING (true);
