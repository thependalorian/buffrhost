"""
File utility functions for Buffr Host platform.

This module provides file operations including saving, deleting, validation,
and file information retrieval for the application.
"""

import os
import uuid
import shutil
import mimetypes
from typing import Dict, List, Optional, Tuple, Any, BinaryIO
from pathlib import Path
from datetime import datetime

from config import settings


def save_file(
    file_data: BinaryIO,
    filename: str,
    directory: str = None,
    allowed_extensions: List[str] = None,
    max_size: int = None
) -> Dict[str, Any]:
    """
    Save an uploaded file to disk.

    Args:
        file_data: File data (file-like object)
        filename: Original filename
        directory: Directory to save file (uses settings default if None)
        allowed_extensions: List of allowed file extensions
        max_size: Maximum file size in bytes

    Returns:
        Dictionary with file information or error details
    """
    result = {
        "success": False,
        "file_path": None,
        "file_url": None,
        "file_size": 0,
        "error": None
    }

    try:
        # Validate file
        validation_result = validate_file(
            file_data,
            filename,
            allowed_extensions,
            max_size
        )

        if not validation_result["valid"]:
            result["error"] = validation_result["error"]
            return result

        # Generate secure filename
        file_extension = Path(filename).suffix.lower()
        secure_filename = f"{uuid.uuid4().hex}{file_extension}"

        # Determine save directory
        if directory is None:
            directory = settings.UPLOAD_DIR

        # Create directory if it doesn't exist
        save_path = Path(directory)
        save_path.mkdir(parents=True, exist_ok=True)

        # Save file
        file_path = save_path / secure_filename

        with open(file_path, 'wb') as f:
            if hasattr(file_data, 'read'):
                # File-like object
                content = file_data.read()
                f.write(content)
            else:
                # Raw bytes
                f.write(file_data)

        # Get file size
        file_size = file_path.stat().st_size

        result.update({
            "success": True,
            "file_path": str(file_path),
            "file_size": file_size,
            "filename": secure_filename,
            "original_filename": filename
        })

    except Exception as e:
        result["error"] = f"Failed to save file: {str(e)}"

    return result


def delete_file(file_path: str) -> bool:
    """
    Delete a file from disk.

    Args:
        file_path: Path to file to delete

    Returns:
        True if deleted successfully, False otherwise
    """
    try:
        if not os.path.exists(file_path):
            return False

        os.remove(file_path)
        return True

    except Exception:
        return False


def get_file_info(file_path: str) -> Optional[Dict[str, Any]]:
    """
    Get information about a file.

    Args:
        file_path: Path to file

    Returns:
        Dictionary with file information or None if file not found
    """
    try:
        if not os.path.exists(file_path):
            return None

        stat = os.stat(file_path)

        # Guess MIME type
        mime_type, encoding = mimetypes.guess_type(file_path)

        return {
            "file_path": file_path,
            "filename": os.path.basename(file_path),
            "size": stat.st_size,
            "created_time": datetime.fromtimestamp(stat.st_ctime),
            "modified_time": datetime.fromtimestamp(stat.st_mtime),
            "mime_type": mime_type or "application/octet-stream",
            "extension": Path(file_path).suffix.lower(),
            "is_file": os.path.isfile(file_path),
            "is_directory": os.path.isdir(file_path)
        }

    except Exception:
        return None


def validate_file(
    file_data,
    filename: str,
    allowed_extensions: List[str] = None,
    max_size: int = None
) -> Dict[str, Any]:
    """
    Validate an uploaded file.

    Args:
        file_data: File data or file path
        filename: Original filename
        allowed_extensions: List of allowed extensions
        max_size: Maximum file size in bytes

    Returns:
        Dictionary with validation result
    """
    result = {
        "valid": False,
        "error": None,
        "file_size": 0,
        "mime_type": None
    }

    try:
        # Check filename
        if not filename or not isinstance(filename, str):
            result["error"] = "Invalid filename"
            return result

        # Get file extension
        file_extension = Path(filename).suffix.lower()

        # Check allowed extensions
        if allowed_extensions:
            if file_extension not in allowed_extensions:
                result["error"] = f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
                return result

        # Get file size
        if hasattr(file_data, 'read'):
            # File-like object - read to get size
            current_pos = getattr(file_data, 'tell', lambda: 0)()
            file_data.seek(0, 2)  # Seek to end
            file_size = file_data.tell()
            file_data.seek(current_pos)  # Reset position
        else:
            # Assume it's a file path
            if os.path.exists(str(file_data)):
                file_size = os.path.getsize(str(file_data))
            else:
                result["error"] = "File not found"
                return result

        result["file_size"] = file_size

        # Check file size
        if max_size and file_size > max_size:
            result["error"] = f"File too large. Maximum size: {format_file_size(max_size)}"
            return result

        # Validate based on file type
        if file_extension in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            if not validate_image_file(file_data, filename):
                result["error"] = "Invalid image file"
                return result

        elif file_extension in ['.pdf']:
            if not validate_pdf_file(file_data):
                result["error"] = "Invalid PDF file"
                return result

        elif file_extension in ['.doc', '.docx']:
            if not validate_document_file(file_data):
                result["error"] = "Invalid document file"
                return result

        # Guess MIME type
        mime_type, _ = mimetypes.guess_type(filename)
        result["mime_type"] = mime_type or "application/octet-stream"

        result["valid"] = True

    except Exception as e:
        result["error"] = f"Validation error: {str(e)}"

    return result


def validate_file_type(filename: str, allowed_types: List[str]) -> bool:
    """
    Validate file type based on extension.

    Args:
        filename: Filename to check
        allowed_types: List of allowed file extensions

    Returns:
        True if file type is allowed, False otherwise
    """
    if not filename:
        return False

    file_extension = Path(filename).suffix.lower()

    return file_extension in allowed_types


def validate_image_file(file_data, filename: str) -> bool:
    """
    Validate image file format and dimensions.

    Args:
        file_data: File data or file path
        filename: Original filename

    Returns:
        True if valid image, False otherwise
    """
    try:
        from PIL import Image

        if hasattr(file_data, 'read'):
            # File-like object - read content
            content = file_data.read()
            file_data.seek(0)  # Reset for other operations
            image = Image.open(file_data)
        else:
            # File path
            image = Image.open(str(file_data))

        # Check if it's actually an image
        image.verify()

        # Check dimensions (optional - could add max dimensions)
        width, height = image.size

        # Basic validation - could be extended
        if width <= 0 or height <= 0:
            return False

        return True

    except Exception:
        return False


def validate_pdf_file(file_data) -> bool:
    """
    Validate PDF file format.

    Args:
        file_data: File data or file path

    Returns:
        True if valid PDF, False otherwise
    """
    try:
        if hasattr(file_data, 'read'):
            # File-like object - read first few bytes
            content = file_data.read(8)
            file_data.seek(0)  # Reset
        else:
            # File path - read first few bytes
            with open(str(file_data), 'rb') as f:
                content = f.read(8)

        # Check PDF signature (%PDF-)
        return content.startswith(b'%PDF-')

    except Exception:
        return False


def validate_document_file(file_data) -> bool:
    """
    Validate document file format.

    Args:
        file_data: File data or file path

    Returns:
        True if valid document, False otherwise
    """
    try:
        if hasattr(file_data, 'read'):
            # File-like object - read first few bytes
            content = file_data.read(8)
            file_data.seek(0)  # Reset
        else:
            # File path - read first few bytes
            with open(str(file_data), 'rb') as f:
                content = f.read(8)

        # Check for DOC signatures
        doc_signatures = [
            b'\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1',  # DOC (older format)
            b'PK\x03\x04',  # DOCX (ZIP-based)
        ]

        return any(content.startswith(sig) for sig in doc_signatures)

    except Exception:
        return False


def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human-readable format.

    Args:
        size_bytes: File size in bytes

    Returns:
        Formatted file size string
    """
    if size_bytes == 0:
        return "0 B"

    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0

    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1

    return f"{size_bytes:.1f} {size_names[i]}"


def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename.

    Args:
        filename: Filename

    Returns:
        File extension (including the dot)
    """
    return Path(filename).suffix.lower()


def generate_unique_filename(original_filename: str) -> str:
    """
    Generate a unique filename while preserving extension.

    Args:
        original_filename: Original filename

    Returns:
        Unique filename with timestamp and UUID
    """
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]

    name_part = Path(original_filename).stem
    extension = Path(original_filename).suffix

    return f"{name_part}_{timestamp}_{unique_id}{extension}"


def copy_file(source_path: str, destination_path: str) -> bool:
    """
    Copy a file from source to destination.

    Args:
        source_path: Source file path
        destination_path: Destination file path

    Returns:
        True if copied successfully, False otherwise
    """
    try:
        # Create destination directory if it doesn't exist
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)

        shutil.copy2(source_path, destination_path)
        return True

    except Exception:
        return False


def move_file(source_path: str, destination_path: str) -> bool:
    """
    Move a file from source to destination.

    Args:
        source_path: Source file path
        destination_path: Destination file path

    Returns:
        True if moved successfully, False otherwise
    """
    try:
        # Create destination directory if it doesn't exist
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)

        shutil.move(source_path, destination_path)
        return True

    except Exception:
        return False


def list_files_in_directory(directory: str, pattern: str = "*") -> List[str]:
    """
    List files in a directory matching a pattern.

    Args:
        directory: Directory path
        pattern: File pattern to match

    Returns:
        List of matching file paths
    """
    try:
        path = Path(directory)
        return [str(file) for file in path.glob(pattern) if file.is_file()]

    except Exception:
        return []


def create_directory(directory: str) -> bool:
    """
    Create a directory if it doesn't exist.

    Args:
        directory: Directory path to create

    Returns:
        True if created successfully, False otherwise
    """
    try:
        Path(directory).mkdir(parents=True, exist_ok=True)
        return True

    except Exception:
        return False


def delete_directory(directory: str) -> bool:
    """
    Delete a directory and all its contents.

    Args:
        directory: Directory path to delete

    Returns:
        True if deleted successfully, False otherwise
    """
    try:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        return True

    except Exception:
        return False


def get_directory_size(directory: str) -> int:
    """
    Calculate the total size of a directory.

    Args:
        directory: Directory path

    Returns:
        Total size in bytes
    """
    try:
        total_size = 0

        for dirpath, dirnames, filenames in os.walk(directory):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                try:
                    total_size += os.path.getsize(filepath)
                except OSError:
                    pass  # Skip files that can't be accessed

        return total_size

    except Exception:
        return 0


def cleanup_old_files(directory: str, max_age_days: int) -> int:
    """
    Clean up files older than specified days.

    Args:
        directory: Directory to clean
        max_age_days: Maximum age in days

    Returns:
        Number of files deleted
    """
    deleted_count = 0
    cutoff_date = datetime.utcnow().timestamp() - (max_age_days * 24 * 3600)

    try:
        for file_path in Path(directory).rglob('*'):
            if file_path.is_file():
                try:
                    if file_path.stat().st_mtime < cutoff_date:
                        file_path.unlink()
                        deleted_count += 1
                except OSError:
                    pass  # Skip files that can't be deleted

    except Exception:
        pass

    return deleted_count


def compress_image(
    image_path: str,
    output_path: str = None,
    quality: int = 80,
    max_width: int = None,
    max_height: int = None
) -> bool:
    """
    Compress an image file.

    Args:
        image_path: Path to source image
        output_path: Path for compressed image (defaults to overwriting source)
        quality: JPEG quality (1-100)
        max_width: Maximum width in pixels
        max_height: Maximum height in pixels

    Returns:
        True if compressed successfully, False otherwise
    """
    try:
        from PIL import Image

        if output_path is None:
            output_path = image_path

        with Image.open(image_path) as img:
            # Resize if needed
            if max_width or max_height:
                img.thumbnail((max_width or img.width, max_height or img.height))

            # Convert to RGB if needed (for JPEG)
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')

            # Save with compression
            img.save(output_path, 'JPEG', quality=quality, optimize=True)

        return True

    except Exception:
        return False


def get_image_dimensions(image_path: str) -> Optional[Tuple[int, int]]:
    """
    Get image dimensions.

    Args:
        image_path: Path to image file

    Returns:
        Tuple of (width, height) or None if not an image
    """
    try:
        from PIL import Image

        with Image.open(image_path) as img:
            return img.size

    except Exception:
        return None


def create_thumbnail(
    image_path: str,
    thumbnail_path: str,
    size: Tuple[int, int] = (150, 150),
    quality: int = 80
) -> bool:
    """
    Create a thumbnail image.

    Args:
        image_path: Path to source image
        thumbnail_path: Path for thumbnail
        size: Thumbnail size (width, height)
        quality: JPEG quality

    Returns:
        True if thumbnail created successfully, False otherwise
    """
    try:
        from PIL import Image

        with Image.open(image_path) as img:
            # Create thumbnail
            img.thumbnail(size)

            # Ensure RGB mode for JPEG
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')

            # Save thumbnail
            img.save(thumbnail_path, 'JPEG', quality=quality)

        return True

    except Exception:
        return False

