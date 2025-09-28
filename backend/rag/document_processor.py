"""
Document Processor for Buffr Host Hospitality Platform

This module handles document processing, text extraction, and content preparation
for the knowledge base. It supports various file formats and optimizes content
for AI agent consumption.
"""

import asyncio
import logging
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import aiofiles
from llama_index.core import Document
from llama_index.core.node_parser import MarkdownNodeParser, SentenceSplitter
from llama_index.core.schema import MetadataMode
# LlamaIndex imports for enhanced document processing
from llama_parse import LlamaParse
from pypdf import PdfReader

from .types import DocumentType

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """
    Processes documents for the knowledge base.

    Handles text extraction, cleaning, and optimization for AI agent consumption.
    """

    def __init__(self):
        self.supported_formats = {
            ".pdf": self._process_pdf,
            ".txt": self._process_text,
            ".md": self._process_markdown,
            ".docx": self._process_docx,
            ".html": self._process_html,
            ".pptx": self._process_pptx,
            ".xlsx": self._process_xlsx,
            ".xls": self._process_xlsx,
        }

        # Initialize LlamaParse for enhanced document processing
        self.llama_parse_api_key = os.getenv("LLAMA_PARSE_API_KEY")
        if self.llama_parse_api_key:
            self.llama_parser = LlamaParse(
                api_key=self.llama_parse_api_key,
                result_type="markdown",
                verbose=True,
                language="en",
            )
            logger.info("LlamaParse initialized successfully")
        else:
            self.llama_parser = None
            logger.warning(
                "LLAMA_PARSE_API_KEY not found. Using fallback document processing."
            )

        # Initialize LlamaIndex node parsers for better text segmentation
        self.markdown_parser = MarkdownNodeParser()
        self.sentence_splitter = SentenceSplitter(
            chunk_size=2000, chunk_overlap=300, separator="\n\n"
        )

    async def process_document(
        self,
        content: str,
        document_type: DocumentType,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Process document content for optimal AI consumption.

        Args:
            content: Raw document content
            document_type: Type of document
            metadata: Additional metadata

        Returns:
            Processed content optimized for AI agents
        """
        try:
            # Clean and normalize content
            processed_content = await self._clean_content(content)

            # Add document type specific processing
            processed_content = await self._add_document_type_context(
                processed_content, document_type, metadata
            )

            # Optimize for AI consumption
            processed_content = await self._optimize_for_ai(processed_content)

            return processed_content

        except Exception as e:
            logger.error(f"Error processing document: {e}")
            raise

    async def process_file(
        self,
        file_path: str,
        document_type: DocumentType,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Process a file and extract content using LlamaParse when available.

        Args:
            file_path: Path to the file
            document_type: Type of document
            metadata: Additional metadata

        Returns:
            Extracted and processed content
        """
        try:
            file_path = Path(file_path)
            file_extension = file_path.suffix.lower()

            if file_extension not in self.supported_formats:
                raise ValueError(f"Unsupported file format: {file_extension}")

            # Try LlamaParse first for supported formats
            if self.llama_parser and file_extension in [".pdf", ".docx", ".pptx"]:
                try:
                    content = await self._process_with_llama_parse(file_path)
                    logger.info(f"Successfully processed {file_path} with LlamaParse")
                except Exception as e:
                    logger.warning(
                        f"LlamaParse failed for {file_path}: {e}. Falling back to standard processing."
                    )
                    content = await self.supported_formats[file_extension](file_path)
            else:
                # Use standard processing
                content = await self.supported_formats[file_extension](file_path)

            # Process the extracted content
            processed_content = await self.process_document(
                content, document_type, metadata
            )

            return processed_content

        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
            raise

    async def _process_with_llama_parse(self, file_path: Path) -> str:
        """
        Process document using LlamaParse for superior markdown conversion.

        Args:
            file_path: Path to the document

        Returns:
            Markdown content with preserved structure, tables, and context
        """
        try:
            # Use LlamaParse to convert document to markdown
            documents = await self.llama_parser.aload_data(str(file_path))

            if not documents:
                raise ValueError("No content extracted from document")

            # Combine all pages/sections into a single markdown document
            markdown_content = ""
            for doc in documents:
                markdown_content += doc.text + "\n\n"

            # Use LlamaIndex node parser to enhance the markdown
            llama_doc = Document(text=markdown_content)
            nodes = self.markdown_parser.get_nodes_from_documents([llama_doc])

            # Reconstruct enhanced markdown with better structure
            enhanced_content = ""
            for node in nodes:
                enhanced_content += node.text + "\n\n"

            return enhanced_content.strip()

        except Exception as e:
            logger.error(f"Error processing with LlamaParse: {e}")
            raise

    async def _clean_content(self, content: str) -> str:
        """Clean and normalize document content."""
        # Remove excessive whitespace
        content = re.sub(r"\s+", " ", content)

        # Remove special characters that might interfere with AI processing
        content = re.sub(r"[^\w\s\.\,\!\?\;\:\-\(\)\[\]\{\}\"\'\/\\]", "", content)

        # Normalize line breaks
        content = content.replace("\r\n", "\n").replace("\r", "\n")

        # Remove multiple consecutive line breaks
        content = re.sub(r"\n\s*\n\s*\n+", "\n\n", content)

        return content.strip()

    async def _add_document_type_context(
        self,
        content: str,
        document_type: DocumentType,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Add document type specific context and formatting."""

        context_prefixes = {
            DocumentType.COMPANY_INFO: "COMPANY INFORMATION:\n",
            DocumentType.POLICIES: "POLICY DOCUMENT:\n",
            DocumentType.PROCEDURES: "PROCEDURE GUIDE:\n",
            DocumentType.FAQ: "FREQUENTLY ASKED QUESTIONS:\n",
            DocumentType.MENU_INFO: "MENU INFORMATION:\n",
            DocumentType.ROOM_INFO: "ROOM INFORMATION:\n",
            DocumentType.SERVICES: "SERVICE INFORMATION:\n",
            DocumentType.AMENITIES: "AMENITIES INFORMATION:\n",
            DocumentType.CONTACT_INFO: "CONTACT INFORMATION:\n",
            DocumentType.EMERGENCY_PROCEDURES: "EMERGENCY PROCEDURES:\n",
            DocumentType.STAFF_TRAINING: "STAFF TRAINING MATERIAL:\n",
            DocumentType.CUSTOMER_SERVICE: "CUSTOMER SERVICE GUIDELINES:\n",
            DocumentType.BOOKING_PROCEDURES: "BOOKING PROCEDURES:\n",
            DocumentType.PAYMENT_POLICIES: "PAYMENT POLICIES:\n",
            DocumentType.CANCELLATION_POLICIES: "CANCELLATION POLICIES:\n",
            DocumentType.LOYALTY_PROGRAM: "LOYALTY PROGRAM INFORMATION:\n",
            DocumentType.OTHER: "DOCUMENT:\n",
        }

        prefix = context_prefixes.get(document_type, "DOCUMENT:\n")

        # Add metadata context if available
        metadata_context = ""
        if metadata:
            if "property_name" in metadata:
                metadata_context += f"Property: {metadata['property_name']}\n"
            if "last_updated" in metadata:
                metadata_context += f"Last Updated: {metadata['last_updated']}\n"

        return f"{prefix}{metadata_context}\n{content}"

    async def _optimize_for_ai(self, content: str) -> str:
        """Optimize content for AI agent consumption."""

        # Add clear section breaks for better AI understanding
        content = re.sub(r"\n([A-Z][A-Z\s]+:)\n", r"\n\n\1\n", content)

        # Ensure questions in FAQ are clearly marked
        content = re.sub(r"\n(Q:|Question:)\s*", r"\n\nQ: ", content)
        content = re.sub(r"\n(A:|Answer:)\s*", r"\nA: ", content)

        # Add clear formatting for lists
        content = re.sub(r"\n(\d+\.\s)", r"\n\n\1", content)
        content = re.sub(r"\n([•\-\*]\s)", r"\n\1", content)

        # Ensure contact information is clearly formatted
        content = re.sub(r"\n(Phone:|Email:|Address:)\s*", r"\n\1 ", content)

        return content

    async def _process_pdf(self, file_path: Path) -> str:
        """Extract text from PDF file."""
        try:
            content = ""
            with open(file_path, "rb") as file:
                pdf_reader = PdfReader(file)
                for page in pdf_reader.pages:
                    content += page.extract_text() + "\n"
            return content
        except Exception as e:
            logger.error(f"Error processing PDF {file_path}: {e}")
            raise

    async def _process_text(self, file_path: Path) -> str:
        """Extract text from plain text file."""
        try:
            async with aiofiles.open(file_path, "r", encoding="utf-8") as file:
                content = await file.read()
            return content
        except Exception as e:
            logger.error(f"Error processing text file {file_path}: {e}")
            raise

    async def _process_markdown(self, file_path: Path) -> str:
        """Extract text from Markdown file."""
        try:
            async with aiofiles.open(file_path, "r", encoding="utf-8") as file:
                content = await file.read()

            # Convert markdown to plain text (basic conversion)
            # Remove markdown syntax
            content = re.sub(r"#{1,6}\s*", "", content)  # Headers
            content = re.sub(r"\*\*(.*?)\*\*", r"\1", content)  # Bold
            content = re.sub(r"\*(.*?)\*", r"\1", content)  # Italic
            content = re.sub(r"`(.*?)`", r"\1", content)  # Code
            content = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", content)  # Links

            return content
        except Exception as e:
            logger.error(f"Error processing markdown file {file_path}: {e}")
            raise

    async def _process_docx(self, file_path: Path) -> str:
        """Extract text from DOCX file."""
        try:
            # This would require python-docx library
            # For now, return a placeholder
            return (
                f"[DOCX content from {file_path.name} - requires python-docx library]"
            )
        except Exception as e:
            logger.error(f"Error processing DOCX file {file_path}: {e}")
            raise

    async def _process_html(self, file_path: Path) -> str:
        """Extract text from HTML file."""
        try:
            async with aiofiles.open(file_path, "r", encoding="utf-8") as file:
                content = await file.read()

            # Basic HTML tag removal
            content = re.sub(r"<[^>]+>", "", content)
            content = re.sub(r"&[^;]+;", " ", content)  # HTML entities

            return content
        except Exception as e:
            logger.error(f"Error processing HTML file {file_path}: {e}")
            raise

    async def _process_pptx(self, file_path: Path) -> str:
        """Extract text from PowerPoint file."""
        try:
            # This would require python-pptx library
            # For now, return a placeholder
            return (
                f"[PPTX content from {file_path.name} - requires python-pptx library]"
            )
        except Exception as e:
            logger.error(f"Error processing PPTX file {file_path}: {e}")
            raise

    async def _process_xlsx(self, file_path: Path) -> str:
        """Extract text from Excel file."""
        try:
            # This would require openpyxl or pandas library
            # For now, return a placeholder
            return f"[Excel content from {file_path.name} - requires openpyxl/pandas library]"
        except Exception as e:
            logger.error(f"Error processing Excel file {file_path}: {e}")
            raise

    async def extract_key_information(
        self, content: str, document_type: DocumentType
    ) -> Dict[str, Any]:
        """
        Extract key information from document content.

        Args:
            content: Document content
            document_type: Type of document

        Returns:
            Dictionary with extracted key information
        """
        try:
            extracted_info = {
                "document_type": document_type.value,
                "word_count": len(content.split()),
                "char_count": len(content),
                "sections": [],
                "key_phrases": [],
                "contact_info": {},
                "dates": [],
                "numbers": [],
            }

            # Extract sections (based on headers)
            sections = re.findall(r"\n([A-Z][A-Z\s]+:)\n", content)
            extracted_info["sections"] = [s.strip() for s in sections]

            # Extract contact information
            phone_pattern = r"(\+?[\d\s\-\(\)]{10,})"
            email_pattern = r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"

            phones = re.findall(phone_pattern, content)
            emails = re.findall(email_pattern, content)

            extracted_info["contact_info"] = {"phones": phones, "emails": emails}

            # Extract dates
            date_pattern = (
                r"\b(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}|\d{4}[/\-]\d{1,2}[/\-]\d{1,2})\b"
            )
            dates = re.findall(date_pattern, content)
            extracted_info["dates"] = dates

            # Extract key phrases (simple approach)
            key_phrases = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b", content)
            extracted_info["key_phrases"] = list(set(key_phrases))[
                :20
            ]  # Top 20 unique phrases

            return extracted_info

        except Exception as e:
            logger.error(f"Error extracting key information: {e}")
            return {}

    async def process_document_with_llama_index(
        self,
        file_path: str,
        document_type: DocumentType,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Process document using LlamaIndex for enhanced markdown conversion and chunking.

        Args:
            file_path: Path to the document
            document_type: Type of document
            metadata: Additional metadata

        Returns:
            Dictionary with processed content, chunks, and metadata
        """
        try:
            file_path = Path(file_path)

            # Process with LlamaParse if available
            if self.llama_parser and file_path.suffix.lower() in [
                ".pdf",
                ".docx",
                ".pptx",
            ]:
                markdown_content = await self._process_with_llama_parse(file_path)
            else:
                # Fallback to standard processing
                markdown_content = await self.process_file(
                    str(file_path), document_type, metadata
                )

            # Create LlamaIndex document
            llama_doc = Document(
                text=markdown_content,
                metadata={
                    "file_path": str(file_path),
                    "document_type": document_type.value,
                    "processed_at": datetime.now().isoformat(),
                    **(metadata or {}),
                },
            )

            # Parse into nodes using LlamaIndex
            nodes = self.markdown_parser.get_nodes_from_documents([llama_doc])

            # Further split into sentences if needed
            final_nodes = []
            for node in nodes:
                if len(node.text) > 2000:  # If node is too large, split further
                    sentence_nodes = self.sentence_splitter.get_nodes_from_documents(
                        [node]
                    )
                    final_nodes.extend(sentence_nodes)
                else:
                    final_nodes.append(node)

            # Prepare result
            result = {
                "original_content": markdown_content,
                "chunks": [
                    {
                        "text": node.text,
                        "metadata": node.metadata,
                        "id": node.id_,
                        "chunk_size": len(node.text),
                    }
                    for node in final_nodes
                ],
                "total_chunks": len(final_nodes),
                "document_type": document_type.value,
                "processing_method": "llama_parse" if self.llama_parser else "standard",
                "metadata": metadata or {},
            }

            logger.info(
                f"Successfully processed {file_path} into {len(final_nodes)} chunks"
            )
            return result

        except Exception as e:
            logger.error(f"Error processing document with LlamaIndex: {e}")
            raise

    async def enhance_markdown_content(self, content: str) -> str:
        """
        Enhance markdown content for better LLM consumption.

        Args:
            content: Raw markdown content

        Returns:
            Enhanced markdown content
        """
        try:
            # Create LlamaIndex document
            llama_doc = Document(text=content)

            # Parse with markdown parser to improve structure
            nodes = self.markdown_parser.get_nodes_from_documents([llama_doc])

            # Reconstruct with better formatting
            enhanced_content = ""
            for node in nodes:
                # Add clear section breaks
                if node.metadata.get("section", ""):
                    enhanced_content += f"\n## {node.metadata['section']}\n\n"

                enhanced_content += node.text + "\n\n"

            # Clean up excessive whitespace
            enhanced_content = re.sub(r"\n\s*\n\s*\n+", "\n\n", enhanced_content)

            return enhanced_content.strip()

        except Exception as e:
            logger.error(f"Error enhancing markdown content: {e}")
            return content
