#!/usr/bin/env python3
"""
Portfolio Backend - Flask API
Napoli Sand Theme Portfolio
"""

import os
import sys
import json
from datetime import datetime, date
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'portfolio_secret_key_2024'

# Enable CORS for all routes
CORS(app, origins=["*"])

# Sample portfolio data
sample_projects = [
    {
        'id': 1,
        'title': 'Digital Transformation Strategy for Public Administration',
        'description': 'Led the development of a comprehensive digital transformation roadmap for a regional government, focusing on citizen services digitization and internal process optimization.',
        'role': 'Senior Project Manager',
        'category': 'PM_Policy',
        'location': 'Naples, Italy',
        'start_date': '2023-03-01',
        'end_date': '2023-12-15',
        'status': 'completed',
        'photos_link': 'https://example.com/photos/digital-transformation',
        'project_link': 'https://example.com/projects/digital-transformation',
        'research_link': 'https://example.com/research/digital-transformation',
        'text_link': 'https://example.com/articles/digital-transformation',
        'tags': ['Digital Transformation', 'Public Administration', 'Strategy', 'Change Management'],
        'skills': ['Project Management', 'Stakeholder Engagement', 'Strategic Planning', 'Digital Strategy'],
        'tools': ['Microsoft Project', 'Miro', 'Slack', 'PowerBI'],
        'people_count': 8,
        'outputs_count': 3
    },
    {
        'id': 2,
        'title': 'Healthcare Service Design for Patient Experience',
        'description': 'Redesigned the patient journey for a major hospital system, improving satisfaction scores by 40% and reducing wait times by 25%.',
        'role': 'Lead UX Designer',
        'category': 'UX_Design',
        'location': 'Milan, Italy',
        'start_date': '2023-06-01',
        'end_date': '2024-02-28',
        'status': 'completed',
        'photos_link': 'https://example.com/photos/healthcare-ux',
        'project_link': 'https://example.com/projects/healthcare-ux',
        'research_link': 'https://example.com/research/healthcare-ux',
        'text_link': 'https://example.com/articles/healthcare-ux',
        'tags': ['Healthcare', 'Service Design', 'Patient Experience', 'Digital Health'],
        'skills': ['User Research', 'Service Design', 'Prototyping', 'Design Thinking'],
        'tools': ['Figma', 'Miro', 'UserVoice', 'Hotjar'],
        'people_count': 6,
        'outputs_count': 4
    },
    {
        'id': 3,
        'title': 'EU Policy Analysis on Digital Rights',
        'description': 'Conducted comprehensive analysis of emerging EU digital rights legislation and its impact on tech companies and citizens.',
        'role': 'Policy Analyst',
        'category': 'PM_Policy',
        'location': 'Brussels, Belgium',
        'start_date': '2022-09-01',
        'end_date': '2023-03-30',
        'status': 'completed',
        'photos_link': 'https://example.com/photos/eu-policy',
        'project_link': 'https://example.com/projects/eu-policy',
        'research_link': 'https://example.com/research/eu-policy',
        'text_link': 'https://example.com/articles/eu-policy',
        'tags': ['EU Policy', 'Digital Rights', 'Legislation', 'Tech Regulation'],
        'skills': ['Policy Analysis', 'Legal Research', 'Stakeholder Mapping', 'Report Writing'],
        'tools': ['Notion', 'Zotero', 'Excel', 'PowerPoint'],
        'people_count': 4,
        'outputs_count': 2
    },
    {
        'id': 4,
        'title': 'Mobile Banking App Redesign',
        'description': 'Complete redesign of a mobile banking application, focusing on accessibility and user-friendly financial management tools.',
        'role': 'Senior UX Designer',
        'category': 'UX_Design',
        'location': 'Remote',
        'start_date': '2022-01-15',
        'end_date': '2022-08-30',
        'status': 'completed',
        'photos_link': 'https://example.com/photos/banking-app',
        'project_link': 'https://example.com/projects/banking-app',
        'research_link': 'https://example.com/research/banking-app',
        'text_link': 'https://example.com/articles/banking-app',
        'tags': ['Mobile App', 'Banking', 'Accessibility', 'FinTech'],
        'skills': ['Mobile UX', 'Accessibility Design', 'User Testing', 'Design Systems'],
        'tools': ['Figma', 'Principle', 'Maze', 'Accessibility Insights'],
        'people_count': 5,
        'outputs_count': 3
    },
    {
        'id': 5,
        'title': 'Smart City Initiative Program Management',
        'description': 'Managed a multi-stakeholder smart city program involving IoT deployment, data analytics, and citizen engagement platforms.',
        'role': 'Program Manager',
        'category': 'PM_Policy',
        'location': 'Turin, Italy',
        'start_date': '2021-05-01',
        'end_date': '2022-12-31',
        'status': 'completed',
        'photos_link': 'https://example.com/photos/smart-city',
        'project_link': 'https://example.com/projects/smart-city',
        'research_link': 'https://example.com/research/smart-city',
        'text_link': 'https://example.com/articles/smart-city',
        'tags': ['Smart City', 'IoT', 'Data Analytics', 'Urban Planning'],
        'skills': ['Program Management', 'IoT Strategy', 'Data Governance', 'Public-Private Partnerships'],
        'tools': ['Asana', 'Tableau', 'ArcGIS', 'Teams'],
        'people_count': 12,
        'outputs_count': 5
    },
    {
        'id': 6,
        'title': 'E-commerce Platform UX Optimization',
        'description': 'Optimized the user experience of a major e-commerce platform, resulting in 30% increase in conversion rates.',
        'role': 'UX Consultant',
        'category': 'UX_Design',
        'location': 'Rome, Italy',
        'start_date': '2024-01-01',
        'end_date': None,
        'status': 'ongoing',
        'photos_link': 'https://example.com/photos/ecommerce-ux',
        'project_link': 'https://example.com/projects/ecommerce-ux',
        'research_link': 'https://example.com/research/ecommerce-ux',
        'text_link': 'https://example.com/articles/ecommerce-ux',
        'tags': ['E-commerce', 'Conversion Optimization', 'A/B Testing', 'Analytics'],
        'skills': ['Conversion Rate Optimization', 'A/B Testing', 'Analytics', 'User Journey Mapping'],
        'tools': ['Google Analytics', 'Optimizely', 'Hotjar', 'Figma'],
        'people_count': 7,
        'outputs_count': 2
    }
]

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'Portfolio API is running',
        'version': '1.0.0',
        'theme': 'Napoli Sand',
        'projects_count': len(sample_projects)
    })

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all projects"""
    return jsonify({
        'projects': sample_projects,
        'total': len(sample_projects)
    })

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get detailed project information"""
    project = next((p for p in sample_projects if p['id'] == project_id), None)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project)

@app.route('/api/network', methods=['GET'])
def get_network_data():
    """Get network visualization data"""
    nodes = []
    edges = []
    
    # Add project nodes
    for project in sample_projects:
        nodes.append({
            'id': f'project-{project["id"]}',
            'label': project['title'][:40] + '...' if len(project['title']) > 40 else project['title'],
            'type': 'project',
            'category': project['category'],
            'data': project
        })
    
    # Add some sample connections
    edges.extend([
        {'source': 'project-1', 'target': 'project-5', 'type': 'domain', 'strength': 0.8},
        {'source': 'project-2', 'target': 'project-4', 'type': 'skills', 'strength': 0.7},
        {'source': 'project-2', 'target': 'project-6', 'type': 'skills', 'strength': 0.6},
        {'source': 'project-1', 'target': 'project-3', 'type': 'domain', 'strength': 0.5}
    ])
    
    return jsonify({
        'nodes': nodes,
        'edges': edges,
        'stats': {
            'total_projects': len(sample_projects),
            'pm_policy_projects': len([p for p in sample_projects if p['category'] == 'PM_Policy']),
            'ux_design_projects': len([p for p in sample_projects if p['category'] == 'UX_Design']),
            'total_people': 42,
            'total_connections': len(edges)
        }
    })

@app.route('/api/stats', methods=['GET'])
def get_portfolio_stats():
    """Get portfolio statistics"""
    pm_projects = [p for p in sample_projects if p['category'] == 'PM_Policy']
    ux_projects = [p for p in sample_projects if p['category'] == 'UX_Design']
    completed_projects = [p for p in sample_projects if p['status'] == 'completed']
    ongoing_projects = [p for p in sample_projects if p['status'] == 'ongoing']
    
    return jsonify({
        'total_projects': len(sample_projects),
        'pm_projects': len(pm_projects),
        'ux_projects': len(ux_projects),
        'completed_projects': len(completed_projects),
        'ongoing_projects': len(ongoing_projects),
        'unique_locations': 6,
        'unique_collaborators': 42,
        'years_active': 4
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

