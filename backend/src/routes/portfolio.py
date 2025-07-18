from flask import Blueprint, jsonify, request
from src.models.portfolio import Project, ProjectPerson, ProjectOutput, ProjectConnection
from src.models.user import db
from datetime import datetime
import json

portfolio_bp = Blueprint('portfolio', __name__)

@portfolio_bp.route('/projects', methods=['GET'])
def get_projects():
    """Get all projects with optional filtering"""
    category = request.args.get('category')  # PM_Policy, UX_Design
    role = request.args.get('role')
    status = request.args.get('status')
    year = request.args.get('year')
    
    query = Project.query
    
    if category:
        query = query.filter(Project.category == category)
    if role:
        query = query.filter(Project.role.contains(role))
    if status:
        query = query.filter(Project.status == status)
    if year:
        query = query.filter(db.extract('year', Project.start_date) == int(year))
    
    projects = query.order_by(Project.start_date.desc()).all()
    
    return jsonify({
        'projects': [project.to_dict() for project in projects],
        'total': len(projects)
    })

@portfolio_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get detailed project information"""
    project = Project.query.get_or_404(project_id)
    
    project_data = project.to_dict()
    project_data['people'] = [person.to_dict() for person in project.people]
    project_data['outputs'] = [output.to_dict() for output in project.outputs]
    
    return jsonify(project_data)

@portfolio_bp.route('/projects', methods=['POST'])
def create_project():
    """Create a new project"""
    data = request.get_json()
    
    project = Project(
        title=data['title'],
        description=data.get('description'),
        role=data['role'],
        category=data['category'],
        location=data.get('location'),
        start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
        end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
        status=data.get('status', 'completed'),
        photos_link=data.get('photos_link'),
        project_link=data.get('project_link'),
        research_link=data.get('research_link'),
        text_link=data.get('text_link'),
        tags=json.dumps(data.get('tags', [])),
        skills=json.dumps(data.get('skills', [])),
        tools=json.dumps(data.get('tools', []))
    )
    
    db.session.add(project)
    db.session.commit()
    
    return jsonify(project.to_dict()), 201

@portfolio_bp.route('/network', methods=['GET'])
def get_network_data():
    """Get network visualization data"""
    projects = Project.query.all()
    connections = ProjectConnection.query.all()
    
    # Create nodes
    nodes = []
    for project in projects:
        node = {
            'id': f'project-{project.id}',
            'label': project.title,
            'type': 'project',
            'category': project.category,
            'role': project.role,
            'location': project.location,
            'year': project.start_date.year if project.start_date else None,
            'status': project.status,
            'data': project.to_dict()
        }
        nodes.append(node)
        
        # Add people as nodes
        for person in project.people:
            person_node = {
                'id': f'person-{person.id}',
                'label': person.name,
                'type': 'person',
                'role': person.role,
                'organization': person.organization,
                'data': person.to_dict()
            }
            nodes.append(person_node)
    
    # Create edges
    edges = []
    
    # Project connections
    for conn in connections:
        edge = {
            'source': f'project-{conn.source_id}',
            'target': f'project-{conn.target_id}',
            'type': conn.connection_type,
            'strength': conn.strength,
            'data': conn.to_dict()
        }
        edges.append(edge)
    
    # People-project connections
    for project in projects:
        for person in project.people:
            edge = {
                'source': f'project-{project.id}',
                'target': f'person-{person.id}',
                'type': 'collaboration',
                'strength': 0.8,
                'data': {'role': person.role}
            }
            edges.append(edge)
    
    return jsonify({
        'nodes': nodes,
        'edges': edges,
        'stats': {
            'total_projects': len(projects),
            'pm_policy_projects': len([p for p in projects if p.category == 'PM_Policy']),
            'ux_design_projects': len([p for p in projects if p.category == 'UX_Design']),
            'total_people': len(set([person.name for project in projects for person in project.people])),
            'total_connections': len(connections)
        }
    })

@portfolio_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get project categories and their counts"""
    categories = db.session.query(
        Project.category,
        db.func.count(Project.id).label('count')
    ).group_by(Project.category).all()
    
    return jsonify({
        'categories': [{'name': cat[0], 'count': cat[1]} for cat in categories]
    })

@portfolio_bp.route('/skills', methods=['GET'])
def get_skills():
    """Get all skills used across projects"""
    projects = Project.query.all()
    all_skills = []
    
    for project in projects:
        if project.skills:
            skills = json.loads(project.skills)
            all_skills.extend(skills)
    
    # Count skill frequency
    skill_counts = {}
    for skill in all_skills:
        skill_counts[skill] = skill_counts.get(skill, 0) + 1
    
    # Sort by frequency
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    
    return jsonify({
        'skills': [{'name': skill[0], 'count': skill[1]} for skill in sorted_skills]
    })

@portfolio_bp.route('/timeline', methods=['GET'])
def get_timeline():
    """Get projects timeline data"""
    projects = Project.query.filter(Project.start_date.isnot(None)).order_by(Project.start_date).all()
    
    timeline_data = []
    for project in projects:
        timeline_data.append({
            'id': project.id,
            'title': project.title,
            'category': project.category,
            'role': project.role,
            'start_date': project.start_date.isoformat(),
            'end_date': project.end_date.isoformat() if project.end_date else None,
            'location': project.location,
            'status': project.status
        })
    
    return jsonify({
        'timeline': timeline_data
    })

@portfolio_bp.route('/stats', methods=['GET'])
def get_portfolio_stats():
    """Get portfolio statistics"""
    total_projects = Project.query.count()
    completed_projects = Project.query.filter(Project.status == 'completed').count()
    ongoing_projects = Project.query.filter(Project.status == 'ongoing').count()
    
    # Get unique locations
    locations = db.session.query(Project.location).filter(Project.location.isnot(None)).distinct().all()
    unique_locations = len([loc[0] for loc in locations])
    
    # Get unique people
    people = db.session.query(ProjectPerson.name).distinct().all()
    unique_people = len([person[0] for person in people])
    
    # Get date range
    first_project = Project.query.filter(Project.start_date.isnot(None)).order_by(Project.start_date).first()
    last_project = Project.query.filter(Project.start_date.isnot(None)).order_by(Project.start_date.desc()).first()
    
    return jsonify({
        'total_projects': total_projects,
        'completed_projects': completed_projects,
        'ongoing_projects': ongoing_projects,
        'unique_locations': unique_locations,
        'unique_collaborators': unique_people,
        'first_project_date': first_project.start_date.isoformat() if first_project else None,
        'last_project_date': last_project.start_date.isoformat() if last_project else None,
        'years_active': (last_project.start_date.year - first_project.start_date.year + 1) if first_project and last_project else 0
    })

