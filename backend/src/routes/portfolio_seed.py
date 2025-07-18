from flask import Blueprint, jsonify
from src.models.portfolio import Project, ProjectPerson, ProjectOutput, ProjectConnection
from src.models.user import db
from datetime import datetime, date
import json

portfolio_seed_bp = Blueprint('portfolio_seed', __name__)

@portfolio_seed_bp.route('/seed-portfolio', methods=['POST'])
def seed_portfolio_data():
    """Seed the database with sample portfolio data"""
    
    # Clear existing data
    db.session.query(ProjectConnection).delete()
    db.session.query(ProjectOutput).delete()
    db.session.query(ProjectPerson).delete()
    db.session.query(Project).delete()
    db.session.commit()
    
    # Sample projects data
    projects_data = [
        {
            'title': 'Digital Transformation Strategy for Public Administration',
            'description': 'Led the development of a comprehensive digital transformation roadmap for a regional government, focusing on citizen services digitization and internal process optimization.',
            'role': 'Senior Project Manager',
            'category': 'PM_Policy',
            'location': 'Naples, Italy',
            'start_date': date(2023, 3, 1),
            'end_date': date(2023, 12, 15),
            'status': 'completed',
            'photos_link': 'https://example.com/photos/digital-transformation',
            'project_link': 'https://example.com/projects/digital-transformation',
            'research_link': 'https://example.com/research/digital-transformation',
            'text_link': 'https://example.com/articles/digital-transformation',
            'tags': ['Digital Transformation', 'Public Administration', 'Strategy', 'Change Management'],
            'skills': ['Project Management', 'Stakeholder Engagement', 'Strategic Planning', 'Digital Strategy'],
            'tools': ['Microsoft Project', 'Miro', 'Slack', 'PowerBI']
        },
        {
            'title': 'Healthcare Service Design for Patient Experience',
            'description': 'Redesigned the patient journey for a major hospital system, improving satisfaction scores by 40% and reducing wait times by 25%.',
            'role': 'Lead UX Designer',
            'category': 'UX_Design',
            'location': 'Milan, Italy',
            'start_date': date(2023, 6, 1),
            'end_date': date(2024, 2, 28),
            'status': 'completed',
            'photos_link': 'https://example.com/photos/healthcare-ux',
            'project_link': 'https://example.com/projects/healthcare-ux',
            'research_link': 'https://example.com/research/healthcare-ux',
            'text_link': 'https://example.com/articles/healthcare-ux',
            'tags': ['Healthcare', 'Service Design', 'Patient Experience', 'Digital Health'],
            'skills': ['User Research', 'Service Design', 'Prototyping', 'Design Thinking'],
            'tools': ['Figma', 'Miro', 'UserVoice', 'Hotjar']
        },
        {
            'title': 'EU Policy Analysis on Digital Rights',
            'description': 'Conducted comprehensive analysis of emerging EU digital rights legislation and its impact on tech companies and citizens.',
            'role': 'Policy Analyst',
            'category': 'PM_Policy',
            'location': 'Brussels, Belgium',
            'start_date': date(2022, 9, 1),
            'end_date': date(2023, 3, 30),
            'status': 'completed',
            'photos_link': 'https://example.com/photos/eu-policy',
            'project_link': 'https://example.com/projects/eu-policy',
            'research_link': 'https://example.com/research/eu-policy',
            'text_link': 'https://example.com/articles/eu-policy',
            'tags': ['EU Policy', 'Digital Rights', 'Legislation', 'Tech Regulation'],
            'skills': ['Policy Analysis', 'Legal Research', 'Stakeholder Mapping', 'Report Writing'],
            'tools': ['Notion', 'Zotero', 'Excel', 'PowerPoint']
        },
        {
            'title': 'Mobile Banking App Redesign',
            'description': 'Complete redesign of a mobile banking application, focusing on accessibility and user-friendly financial management tools.',
            'role': 'Senior UX Designer',
            'category': 'UX_Design',
            'location': 'Remote',
            'start_date': date(2022, 1, 15),
            'end_date': date(2022, 8, 30),
            'status': 'completed',
            'photos_link': 'https://example.com/photos/banking-app',
            'project_link': 'https://example.com/projects/banking-app',
            'research_link': 'https://example.com/research/banking-app',
            'text_link': 'https://example.com/articles/banking-app',
            'tags': ['Mobile App', 'Banking', 'Accessibility', 'FinTech'],
            'skills': ['Mobile UX', 'Accessibility Design', 'User Testing', 'Design Systems'],
            'tools': ['Figma', 'Principle', 'Maze', 'Accessibility Insights']
        },
        {
            'title': 'Smart City Initiative Program Management',
            'description': 'Managed a multi-stakeholder smart city program involving IoT deployment, data analytics, and citizen engagement platforms.',
            'role': 'Program Manager',
            'category': 'PM_Policy',
            'location': 'Turin, Italy',
            'start_date': date(2021, 5, 1),
            'end_date': date(2022, 12, 31),
            'status': 'completed',
            'photos_link': 'https://example.com/photos/smart-city',
            'project_link': 'https://example.com/projects/smart-city',
            'research_link': 'https://example.com/research/smart-city',
            'text_link': 'https://example.com/articles/smart-city',
            'tags': ['Smart City', 'IoT', 'Data Analytics', 'Urban Planning'],
            'skills': ['Program Management', 'IoT Strategy', 'Data Governance', 'Public-Private Partnerships'],
            'tools': ['Asana', 'Tableau', 'ArcGIS', 'Teams']
        },
        {
            'title': 'E-commerce Platform UX Optimization',
            'description': 'Optimized the user experience of a major e-commerce platform, resulting in 30% increase in conversion rates.',
            'role': 'UX Consultant',
            'category': 'UX_Design',
            'location': 'Rome, Italy',
            'start_date': date(2024, 1, 1),
            'end_date': None,
            'status': 'ongoing',
            'photos_link': 'https://example.com/photos/ecommerce-ux',
            'project_link': 'https://example.com/projects/ecommerce-ux',
            'research_link': 'https://example.com/research/ecommerce-ux',
            'text_link': 'https://example.com/articles/ecommerce-ux',
            'tags': ['E-commerce', 'Conversion Optimization', 'A/B Testing', 'Analytics'],
            'skills': ['Conversion Rate Optimization', 'A/B Testing', 'Analytics', 'User Journey Mapping'],
            'tools': ['Google Analytics', 'Optimizely', 'Hotjar', 'Figma']
        }
    ]
    
    # Create projects
    created_projects = []
    for project_data in projects_data:
        project = Project(
            title=project_data['title'],
            description=project_data['description'],
            role=project_data['role'],
            category=project_data['category'],
            location=project_data['location'],
            start_date=project_data['start_date'],
            end_date=project_data['end_date'],
            status=project_data['status'],
            photos_link=project_data['photos_link'],
            project_link=project_data['project_link'],
            research_link=project_data['research_link'],
            text_link=project_data['text_link'],
            tags=json.dumps(project_data['tags']),
            skills=json.dumps(project_data['skills']),
            tools=json.dumps(project_data['tools'])
        )
        db.session.add(project)
        created_projects.append(project)
    
    db.session.commit()
    
    # Sample people data
    people_data = [
        {'project_idx': 0, 'name': 'Marco Rossi', 'role': 'Client', 'organization': 'Regional Government of Campania', 'email': 'marco.rossi@regione.campania.it'},
        {'project_idx': 0, 'name': 'Anna Bianchi', 'role': 'Technical Lead', 'organization': 'TechConsult SRL', 'email': 'anna.bianchi@techconsult.it'},
        {'project_idx': 1, 'name': 'Dr. Giuseppe Verde', 'role': 'Medical Director', 'organization': 'Ospedale San Paolo', 'email': 'g.verde@sanpaolo.it'},
        {'project_idx': 1, 'name': 'Laura Neri', 'role': 'UX Researcher', 'organization': 'Freelance', 'email': 'laura.neri@gmail.com'},
        {'project_idx': 2, 'name': 'Jean-Pierre Dubois', 'role': 'Policy Advisor', 'organization': 'European Commission', 'email': 'jean-pierre.dubois@ec.europa.eu'},
        {'project_idx': 3, 'name': 'Alessandro Conti', 'role': 'Product Manager', 'organization': 'BancaDigitale', 'email': 'a.conti@bancadigitale.it'},
        {'project_idx': 4, 'name': 'Francesca Lombardi', 'role': 'Mayor', 'organization': 'City of Turin', 'email': 'sindaco@comune.torino.it'},
        {'project_idx': 5, 'name': 'Roberto Ferrari', 'role': 'CEO', 'organization': 'ShopItalia', 'email': 'r.ferrari@shopitalia.com'}
    ]
    
    # Create people
    for person_data in people_data:
        person = ProjectPerson(
            project_id=created_projects[person_data['project_idx']].id,
            name=person_data['name'],
            role=person_data['role'],
            organization=person_data['organization'],
            email=person_data['email']
        )
        db.session.add(person)
    
    # Sample outputs data
    outputs_data = [
        {'project_idx': 0, 'title': 'Digital Transformation Roadmap', 'type': 'Strategy Document', 'description': 'Comprehensive 5-year roadmap for digital transformation'},
        {'project_idx': 0, 'title': 'Stakeholder Engagement Plan', 'type': 'Process Document', 'description': 'Detailed plan for engaging all stakeholders'},
        {'project_idx': 1, 'title': 'Patient Journey Map', 'type': 'Design Artifact', 'description': 'Visual representation of the improved patient experience'},
        {'project_idx': 1, 'title': 'Service Design Prototype', 'type': 'Prototype', 'description': 'Interactive prototype of the new service touchpoints'},
        {'project_idx': 2, 'title': 'EU Digital Rights Analysis Report', 'type': 'Research Report', 'description': 'In-depth analysis of current and proposed legislation'},
        {'project_idx': 3, 'title': 'Mobile Banking Design System', 'type': 'Design System', 'description': 'Comprehensive design system for the mobile app'},
        {'project_idx': 4, 'title': 'Smart City Implementation Plan', 'type': 'Implementation Guide', 'description': 'Step-by-step implementation plan for smart city initiatives'},
        {'project_idx': 5, 'title': 'UX Audit Report', 'type': 'Audit Report', 'description': 'Comprehensive UX audit with recommendations'}
    ]
    
    # Create outputs
    for output_data in outputs_data:
        output = ProjectOutput(
            project_id=created_projects[output_data['project_idx']].id,
            title=output_data['title'],
            type=output_data['type'],
            description=output_data['description'],
            url=f"https://example.com/outputs/{output_data['title'].lower().replace(' ', '-')}"
        )
        db.session.add(output)
    
    # Sample connections data
    connections_data = [
        {'source_idx': 0, 'target_idx': 4, 'type': 'domain', 'strength': 0.8, 'description': 'Both projects involve public sector digital transformation'},
        {'source_idx': 1, 'target_idx': 3, 'type': 'skills', 'strength': 0.7, 'description': 'Both projects required extensive user research and design'},
        {'source_idx': 2, 'target_idx': 0, 'type': 'domain', 'strength': 0.6, 'description': 'Both projects involve policy and regulatory considerations'},
        {'source_idx': 3, 'target_idx': 5, 'type': 'skills', 'strength': 0.9, 'description': 'Both projects focused on UX optimization and conversion'},
        {'source_idx': 1, 'target_idx': 5, 'type': 'skills', 'strength': 0.8, 'description': 'Both projects involved service design and user experience'}
    ]
    
    # Create connections
    for conn_data in connections_data:
        connection = ProjectConnection(
            source_id=created_projects[conn_data['source_idx']].id,
            target_id=created_projects[conn_data['target_idx']].id,
            connection_type=conn_data['type'],
            strength=conn_data['strength'],
            description=conn_data['description']
        )
        db.session.add(connection)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Portfolio data seeded successfully',
        'projects_created': len(created_projects),
        'people_created': len(people_data),
        'outputs_created': len(outputs_data),
        'connections_created': len(connections_data)
    })

