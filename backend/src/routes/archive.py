from flask import Blueprint, request, jsonify
from src.models.archive import db, Archive, ArchiveItem, Annotation, ItemConnection, VoiceRecording
from datetime import datetime
import json

archive_bp = Blueprint('archive', __name__)

# Archives endpoints
@archive_bp.route('/archives', methods=['GET'])
def get_archives():
    """Get all archives"""
    archives = Archive.query.all()
    return jsonify([archive.to_dict() for archive in archives])

@archive_bp.route('/archives/<slug>', methods=['GET'])
def get_archive(slug):
    """Get specific archive by slug"""
    archive = Archive.query.filter_by(slug=slug).first()
    if not archive:
        return jsonify({'error': 'Archive not found'}), 404
    return jsonify(archive.to_dict())

@archive_bp.route('/archives', methods=['POST'])
def create_archive():
    """Create new archive"""
    data = request.get_json()
    
    archive = Archive(
        name=data['name'],
        slug=data['slug'],
        description=data.get('description'),
        color=data.get('color', '#3B82F6')
    )
    
    db.session.add(archive)
    db.session.commit()
    
    return jsonify(archive.to_dict()), 201

# Archive items endpoints
@archive_bp.route('/archives/<slug>/items', methods=['GET'])
def get_archive_items(slug):
    """Get all items for an archive"""
    archive = Archive.query.filter_by(slug=slug).first()
    if not archive:
        return jsonify({'error': 'Archive not found'}), 404
    
    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    items = ArchiveItem.query.filter_by(archive_id=archive.id)\
                           .order_by(ArchiveItem.created_at.desc())\
                           .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'items': [item.to_dict() for item in items.items],
        'total': items.total,
        'pages': items.pages,
        'current_page': page
    })

@archive_bp.route('/archives/<slug>/items', methods=['POST'])
def create_archive_item(slug):
    """Create new archive item"""
    archive = Archive.query.filter_by(slug=slug).first()
    if not archive:
        return jsonify({'error': 'Archive not found'}), 404
    
    data = request.get_json()
    
    item = ArchiveItem(
        archive_id=archive.id,
        title=data['title'],
        code=data.get('code'),
        description=data.get('description'),
        location=data.get('location'),
        content=data.get('content'),
        image_url=data.get('image_url'),
        audio_url=data.get('audio_url')
    )
    
    db.session.add(item)
    db.session.commit()
    
    return jsonify(item.to_dict()), 201

@archive_bp.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """Get specific item with annotations and connections"""
    item = ArchiveItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    item_data = item.to_dict()
    item_data['annotations'] = [ann.to_dict() for ann in item.annotations]
    item_data['connections'] = [conn.to_dict() for conn in item.connections]
    item_data['voice_recordings'] = [rec.to_dict() for rec in item.voice_recordings]
    
    return jsonify(item_data)

@archive_bp.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    """Update item"""
    item = ArchiveItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    for field in ['title', 'code', 'description', 'location', 'content', 'image_url', 'audio_url']:
        if field in data:
            setattr(item, field, data[field])
    
    item.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(item.to_dict())

# Annotations endpoints
@archive_bp.route('/items/<int:item_id>/annotations', methods=['POST'])
def create_annotation(item_id):
    """Create annotation for item"""
    item = ArchiveItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    data = request.get_json()
    
    annotation = Annotation(
        item_id=item_id,
        text=data['text'],
        start_pos=data.get('start_pos'),
        end_pos=data.get('end_pos'),
        annotation_type=data['annotation_type'],
        entity_uri=data.get('entity_uri'),
        confidence=data.get('confidence', 1.0),
        created_by=data.get('created_by', 'system')
    )
    
    db.session.add(annotation)
    db.session.commit()
    
    return jsonify(annotation.to_dict()), 201

@archive_bp.route('/annotations/<int:annotation_id>', methods=['DELETE'])
def delete_annotation(annotation_id):
    """Delete annotation"""
    annotation = Annotation.query.get(annotation_id)
    if not annotation:
        return jsonify({'error': 'Annotation not found'}), 404
    
    db.session.delete(annotation)
    db.session.commit()
    
    return jsonify({'message': 'Annotation deleted'})

# Connections endpoints
@archive_bp.route('/items/<int:item_id>/connections', methods=['POST'])
def create_connection(item_id):
    """Create connection between items"""
    data = request.get_json()
    
    # Verify both items exist
    source_item = ArchiveItem.query.get(item_id)
    target_item = ArchiveItem.query.get(data['target_id'])
    
    if not source_item or not target_item:
        return jsonify({'error': 'One or both items not found'}), 404
    
    connection = ItemConnection(
        source_id=item_id,
        target_id=data['target_id'],
        connection_type=data['connection_type'],
        strength=data.get('strength', 1.0),
        properties=json.dumps(data.get('properties', {}))
    )
    
    db.session.add(connection)
    db.session.commit()
    
    return jsonify(connection.to_dict()), 201

# Voice recordings endpoints
@archive_bp.route('/items/<int:item_id>/voice-recordings', methods=['POST'])
def create_voice_recording(item_id):
    """Create voice recording for item"""
    item = ArchiveItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    data = request.get_json()
    
    recording = VoiceRecording(
        item_id=item_id,
        audio_url=data['audio_url'],
        transcript=data.get('transcript'),
        duration=data.get('duration'),
        text_start=data.get('text_start'),
        text_end=data.get('text_end'),
        created_by=data.get('created_by', 'user')
    )
    
    db.session.add(recording)
    db.session.commit()
    
    return jsonify(recording.to_dict()), 201

# Graph data endpoint
@archive_bp.route('/archives/<slug>/graph', methods=['GET'])
def get_archive_graph(slug):
    """Get graph data for archive visualization"""
    archive = Archive.query.filter_by(slug=slug).first()
    if not archive:
        return jsonify({'error': 'Archive not found'}), 404
    
    # Get all items and their connections
    items = ArchiveItem.query.filter_by(archive_id=archive.id).all()
    connections = ItemConnection.query.join(ArchiveItem, ItemConnection.source_id == ArchiveItem.id)\
                                    .filter(ArchiveItem.archive_id == archive.id).all()
    
    # Build nodes
    nodes = []
    for item in items:
        # Get annotation types for this item
        annotation_types = db.session.query(Annotation.annotation_type)\
                                   .filter_by(item_id=item.id)\
                                   .distinct().all()
        
        node = {
            'id': f"item_{item.id}",
            'label': item.title,
            'type': 'item',
            'data': item.to_dict(),
            'annotation_types': [t[0] for t in annotation_types]
        }
        nodes.append(node)
        
        # Add annotation nodes
        for annotation in item.annotations:
            ann_node = {
                'id': f"annotation_{annotation.id}",
                'label': annotation.text[:50] + "..." if len(annotation.text) > 50 else annotation.text,
                'type': annotation.annotation_type,
                'data': annotation.to_dict()
            }
            nodes.append(ann_node)
    
    # Build edges
    edges = []
    
    # Item connections
    for conn in connections:
        edge = {
            'id': f"conn_{conn.id}",
            'source': f"item_{conn.source_id}",
            'target': f"item_{conn.target_id}",
            'type': conn.connection_type,
            'strength': conn.strength,
            'data': conn.to_dict()
        }
        edges.append(edge)
    
    # Annotation to item connections
    for item in items:
        for annotation in item.annotations:
            edge = {
                'id': f"item_ann_{item.id}_{annotation.id}",
                'source': f"item_{item.id}",
                'target': f"annotation_{annotation.id}",
                'type': 'annotation',
                'strength': annotation.confidence
            }
            edges.append(edge)
    
    return jsonify({
        'nodes': nodes,
        'edges': edges,
        'archive': archive.to_dict()
    })

# Search endpoint
@archive_bp.route('/search', methods=['GET'])
def search():
    """Search across all archives"""
    query = request.args.get('q', '')
    archive_slug = request.args.get('archive')
    annotation_type = request.args.get('type')
    
    if not query:
        return jsonify({'results': []})
    
    # Build base query
    base_query = ArchiveItem.query
    
    if archive_slug:
        archive = Archive.query.filter_by(slug=archive_slug).first()
        if archive:
            base_query = base_query.filter_by(archive_id=archive.id)
    
    # Search in title, description, and content
    search_filter = db.or_(
        ArchiveItem.title.contains(query),
        ArchiveItem.description.contains(query),
        ArchiveItem.content.contains(query)
    )
    
    items = base_query.filter(search_filter).limit(50).all()
    
    # Also search in annotations
    annotation_query = Annotation.query.filter(Annotation.text.contains(query))
    if annotation_type:
        annotation_query = annotation_query.filter_by(annotation_type=annotation_type)
    
    annotations = annotation_query.limit(50).all()
    
    results = {
        'items': [item.to_dict() for item in items],
        'annotations': [ann.to_dict() for ann in annotations],
        'total': len(items) + len(annotations)
    }
    
    return jsonify(results)

# SPARQL-like endpoint for linked data
@archive_bp.route('/sparql', methods=['GET', 'POST'])
def sparql_endpoint():
    """Simple SPARQL-like endpoint for linked data queries"""
    if request.method == 'POST':
        query = request.get_json().get('query', '')
    else:
        query = request.args.get('query', '')
    
    # This is a simplified implementation
    # In a real system, you'd use a proper SPARQL engine like Apache Jena
    
    results = []
    
    # Simple pattern matching for demo purposes
    if 'SELECT' in query.upper():
        # Return all items with their annotations as RDF-like triples
        items = ArchiveItem.query.limit(100).all()
        
        for item in items:
            # Item triples
            item_uri = f"http://archival-consciousness.org/item/{item.id}"
            results.append({
                'subject': item_uri,
                'predicate': 'http://purl.org/dc/terms/title',
                'object': item.title
            })
            
            if item.description:
                results.append({
                    'subject': item_uri,
                    'predicate': 'http://purl.org/dc/terms/description',
                    'object': item.description
                })
            
            # Annotation triples
            for annotation in item.annotations:
                ann_uri = f"http://archival-consciousness.org/annotation/{annotation.id}"
                results.append({
                    'subject': ann_uri,
                    'predicate': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                    'object': f"http://archival-consciousness.org/ontology/{annotation.annotation_type}"
                })
                results.append({
                    'subject': ann_uri,
                    'predicate': 'http://archival-consciousness.org/ontology/annotates',
                    'object': item_uri
                })
    
    return jsonify({
        'results': results,
        'count': len(results)
    })

