from src.models.user import db
from datetime import datetime
import json

class Archive(db.Model):
    __tablename__ = 'archives'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    color = db.Column(db.String(7), default='#3B82F6')  # hex color
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    items = db.relationship('ArchiveItem', backref='archive', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'color': self.color,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'item_count': len(self.items)
        }

class ArchiveItem(db.Model):
    __tablename__ = 'archive_items'
    
    id = db.Column(db.Integer, primary_key=True)
    archive_id = db.Column(db.Integer, db.ForeignKey('archives.id'), nullable=False)
    
    # Basic metadata
    title = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(50))  # e.g., "VLI-D-1", "MUR-1"
    description = db.Column(db.Text)
    location = db.Column(db.String(100))  # e.g., "object on table 2"
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Content
    content = db.Column(db.Text)  # Full text content
    image_url = db.Column(db.String(500))
    audio_url = db.Column(db.String(500))
    
    # Relationships
    annotations = db.relationship('Annotation', backref='item', lazy=True, cascade='all, delete-orphan')
    connections = db.relationship('ItemConnection', 
                                foreign_keys='ItemConnection.source_id',
                                backref='source_item', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'archive_id': self.archive_id,
            'title': self.title,
            'code': self.code,
            'description': self.description,
            'location': self.location,
            'content': self.content,
            'image_url': self.image_url,
            'audio_url': self.audio_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'annotation_count': len(self.annotations)
        }

class Annotation(db.Model):
    __tablename__ = 'annotations'
    
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('archive_items.id'), nullable=False)
    
    # Annotation data
    text = db.Column(db.Text, nullable=False)
    start_pos = db.Column(db.Integer)  # Character position in text
    end_pos = db.Column(db.Integer)
    
    # Annotation type (6 categories from Media Futures)
    annotation_type = db.Column(db.String(50), nullable=False)  # Place, Period, Entity, Objects, Events, Terms
    
    # Semantic data
    entity_uri = db.Column(db.String(500))  # URI for linked data
    confidence = db.Column(db.Float, default=1.0)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(100))  # User or system
    
    def to_dict(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'text': self.text,
            'start_pos': self.start_pos,
            'end_pos': self.end_pos,
            'annotation_type': self.annotation_type,
            'entity_uri': self.entity_uri,
            'confidence': self.confidence,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'created_by': self.created_by
        }

class ItemConnection(db.Model):
    __tablename__ = 'item_connections'
    
    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, db.ForeignKey('archive_items.id'), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('archive_items.id'), nullable=False)
    
    # Connection metadata
    connection_type = db.Column(db.String(50), nullable=False)  # semantic, temporal, spatial, etc.
    strength = db.Column(db.Float, default=1.0)  # Connection strength 0-1
    properties = db.Column(db.Text)  # JSON string for additional properties
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    target_item = db.relationship('ArchiveItem', foreign_keys=[target_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'source_id': self.source_id,
            'target_id': self.target_id,
            'connection_type': self.connection_type,
            'strength': self.strength,
            'properties': json.loads(self.properties) if self.properties else {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class VoiceRecording(db.Model):
    __tablename__ = 'voice_recordings'
    
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('archive_items.id'), nullable=False)
    
    # Recording data
    audio_url = db.Column(db.String(500), nullable=False)
    transcript = db.Column(db.Text)
    duration = db.Column(db.Float)  # Duration in seconds
    
    # Text fragment info
    text_start = db.Column(db.Integer)  # Start position in item content
    text_end = db.Column(db.Integer)    # End position in item content
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(100))
    
    # Relationships
    item = db.relationship('ArchiveItem', backref='voice_recordings')
    
    def to_dict(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'audio_url': self.audio_url,
            'transcript': self.transcript,
            'duration': self.duration,
            'text_start': self.text_start,
            'text_end': self.text_end,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'created_by': self.created_by
        }

