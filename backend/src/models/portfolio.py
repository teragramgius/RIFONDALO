from src.models.user import db
from datetime import datetime
import json

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    role = db.Column(db.String(100), nullable=False)  # Project Manager, UX Designer, etc.
    category = db.Column(db.String(50), nullable=False)  # PM_Policy, UX_Design
    location = db.Column(db.String(100))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='completed')  # ongoing, completed, paused
    
    # Showcase links
    photos_link = db.Column(db.String(500))
    project_link = db.Column(db.String(500))
    research_link = db.Column(db.String(500))
    text_link = db.Column(db.String(500))
    
    # Metadata
    tags = db.Column(db.Text)  # JSON array of tags
    skills = db.Column(db.Text)  # JSON array of skills used
    tools = db.Column(db.Text)  # JSON array of tools used
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    people = db.relationship('ProjectPerson', back_populates='project', cascade='all, delete-orphan')
    outputs = db.relationship('ProjectOutput', back_populates='project', cascade='all, delete-orphan')
    connections = db.relationship('ProjectConnection', 
                                foreign_keys='ProjectConnection.source_id',
                                back_populates='source_project',
                                cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'role': self.role,
            'category': self.category,
            'location': self.location,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
            'photos_link': self.photos_link,
            'project_link': self.project_link,
            'research_link': self.research_link,
            'text_link': self.text_link,
            'tags': json.loads(self.tags) if self.tags else [],
            'skills': json.loads(self.skills) if self.skills else [],
            'tools': json.loads(self.tools) if self.tools else [],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'people_count': len(self.people),
            'outputs_count': len(self.outputs)
        }

class ProjectPerson(db.Model):
    __tablename__ = 'project_people'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))  # Client, Collaborator, Team Member, etc.
    organization = db.Column(db.String(200))
    email = db.Column(db.String(100))
    linkedin = db.Column(db.String(200))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='people')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'organization': self.organization,
            'email': self.email,
            'linkedin': self.linkedin,
            'created_at': self.created_at.isoformat()
        }

class ProjectOutput(db.Model):
    __tablename__ = 'project_outputs'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # Report, Prototype, Policy, Design System, etc.
    description = db.Column(db.Text)
    url = db.Column(db.String(500))
    file_path = db.Column(db.String(500))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='outputs')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'description': self.description,
            'url': self.url,
            'file_path': self.file_path,
            'created_at': self.created_at.isoformat()
        }

class ProjectConnection(db.Model):
    __tablename__ = 'project_connections'
    
    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    connection_type = db.Column(db.String(50), nullable=False)  # people, skills, domain, output_type
    strength = db.Column(db.Float, default=1.0)  # 0.0 to 1.0
    description = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    source_project = db.relationship('Project', foreign_keys=[source_id], back_populates='connections')
    target_project = db.relationship('Project', foreign_keys=[target_id])

    def to_dict(self):
        return {
            'id': self.id,
            'source_id': self.source_id,
            'target_id': self.target_id,
            'connection_type': self.connection_type,
            'strength': self.strength,
            'description': self.description,
            'created_at': self.created_at.isoformat()
        }

