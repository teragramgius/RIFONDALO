from flask import Blueprint, jsonify
from src.models.archive import db, Archive, ArchiveItem, Annotation, ItemConnection
from datetime import datetime, timedelta
import random

seed_bp = Blueprint('seed', __name__)

@seed_bp.route('/seed-data', methods=['POST'])
def seed_data():
    """Seed the database with sample data"""
    
    # Clear existing data
    db.session.query(ItemConnection).delete()
    db.session.query(Annotation).delete()
    db.session.query(ArchiveItem).delete()
    db.session.query(Archive).delete()
    db.session.commit()
    
    # Create archives
    archives_data = [
        {
            'name': 'de Appel Archive',
            'slug': 'de-appel',
            'description': 'Since its inauguration in 1975, de Appel presented 1131 events and exhibitions, made in collaborations with 29.682 people, 945 collectives, and 4.134 institutes from 436 cities and 68 countries.',
            'color': '#F59E0B'  # Orange
        },
        {
            'name': 'Jan van Eyck Academy Archive',
            'slug': 'jan-van-eyck',
            'description': 'The Jan van Eyck Academy archive contains documentation of artistic research and experimental practices.',
            'color': '#8B5CF6'  # Purple
        },
        {
            'name': 'Framer Framed Archive',
            'slug': 'framer-framed',
            'description': 'Framer Framed archive focuses on contemporary art and cultural practices from diverse perspectives.',
            'color': '#10B981'  # Green
        },
        {
            'name': 'Kunstinstituut Melly',
            'slug': 'kunstinstituut-melly',
            'description': 'Archive of contemporary art and cultural activities from Kunstinstituut Melly.',
            'color': '#EF4444'  # Red
        }
    ]
    
    archives = []
    for archive_data in archives_data:
        archive = Archive(**archive_data)
        db.session.add(archive)
        archives.append(archive)
    
    db.session.commit()
    
    # Sample items data based on real examples from the site
    items_data = [
        {
            'archive': 'de-appel',
            'title': 'Don van Vliet – TGV tentoonstelling',
            'code': 'VLI-D-1',
            'description': 'Exhibition documentation of Don van Vliet (Captain Beefheart) TGV exhibition',
            'location': 'object on table 2',
            'content': 'Don van Vliet, also known as Captain Beefheart, was an American musician, singer, songwriter, and artist. His musical work was conducted with his backing band the Magic Band and was marked by his powerful singing voice with its wide range, and his surrealism and eccentricity.',
            'image_url': '/api/images/don-van-vliet.jpg'
        },
        {
            'archive': 'de-appel',
            'title': 'Teresa Murak – 1974-1978',
            'code': 'MUR-1',
            'description': 'Documentation of Teresa Murak\'s work from 1974-1978 period',
            'location': 'object on table 2',
            'content': 'Teresa Murak is a Polish artist known for her pioneering work in performance art and land art. Her work from 1974-1978 represents a crucial period in the development of conceptual art in Eastern Europe.',
            'image_url': '/api/images/teresa-murak.jpg'
        },
        {
            'archive': 'de-appel',
            'title': 'Rosa te Velde – Drafting futures, Remembering a building',
            'code': 'APPEL-LIB-202001',
            'description': 'Schetsen voor de toekomst, herinneringen aan een gebouw',
            'location': 'object on table 2',
            'content': 'Rosa te Velde explores the relationship between architecture, memory, and future possibilities through her artistic practice.',
            'image_url': '/api/images/rosa-te-velde.jpg'
        },
        {
            'archive': 'de-appel',
            'title': 'WEST SIDE TORI\'S – Editie 2 – april 2024',
            'code': 'APPEL-LIB-202427',
            'description': 'Contemporary publication documenting urban culture and artistic practices',
            'location': 'object on table 2',
            'content': 'WEST SIDE TORI\'S is a publication that documents contemporary urban culture and artistic practices in Amsterdam.',
            'image_url': '/api/images/west-side-toris.jpg'
        },
        {
            'archive': 'de-appel',
            'title': 'Matt Mullican – The MIT Project',
            'code': 'MULL-M-1',
            'description': 'Documentation of Matt Mullican\'s MIT Project',
            'location': 'object on table 2',
            'content': 'Matt Mullican\'s MIT Project explores the relationship between consciousness, representation, and reality through systematic investigation.',
            'image_url': '/api/images/matt-mullican-mit.jpg'
        },
        {
            'archive': 'de-appel',
            'title': 'Matt Mullican – 12 by 2',
            'code': 'MULL-M-13',
            'description': 'Matt Mullican\'s 12 by 2 project documentation',
            'location': 'object on table 2',
            'content': 'The 12 by 2 project represents Mullican\'s systematic approach to understanding and representing reality through symbolic systems.',
            'image_url': '/api/images/matt-mullican-12by2.jpg'
        },
        {
            'archive': 'jan-van-eyck',
            'title': 'Decolonial Futures Educational Programme',
            'code': 'JVE-DF-2021',
            'description': 'Educational programme organised between Sandberg Instituut, Gerrit Rietveld Academie and Framer Framed',
            'location': 'archive section A',
            'content': 'Decolonial Futures is an educational programme organised between the Sandberg Instituut, the Gerrit Rietveld Academie and Framer Framed in Amsterdam as well as Funda Community College in Soweto, South Africa.',
            'image_url': '/api/images/decolonial-futures.jpg'
        },
        {
            'archive': 'framer-framed',
            'title': 'Catching Up in the Archive',
            'code': 'FF-CUTA-2022',
            'description': 'Installation views from Catching Up in the Archive exhibition, 2022',
            'location': 'exhibition space',
            'content': 'Catching Up in the Archive, 2022, installation views. Photography: Johannes Schwartz. An exploration of archival practices and contemporary art.',
            'image_url': '/api/images/catching-up-archive.jpg'
        }
    ]
    
    # Create items
    items = []
    for item_data in items_data:
        archive = next(a for a in archives if a.slug == item_data['archive'])
        
        # Create random timestamp within last year
        days_ago = random.randint(1, 365)
        created_time = datetime.utcnow() - timedelta(days=days_ago)
        
        item = ArchiveItem(
            archive_id=archive.id,
            title=item_data['title'],
            code=item_data['code'],
            description=item_data['description'],
            location=item_data['location'],
            content=item_data['content'],
            image_url=item_data['image_url'],
            created_at=created_time
        )
        db.session.add(item)
        items.append(item)
    
    db.session.commit()
    
    # Create annotations
    annotation_types = ['Place', 'Period', 'Entity', 'Objects', 'Events', 'Terms']
    
    annotations_data = [
        # Don van Vliet annotations
        {'item_idx': 0, 'text': 'Don van Vliet', 'type': 'Entity', 'start': 0, 'end': 13},
        {'item_idx': 0, 'text': 'Captain Beefheart', 'type': 'Entity', 'start': 29, 'end': 46},
        {'item_idx': 0, 'text': 'American', 'type': 'Place', 'start': 55, 'end': 63},
        {'item_idx': 0, 'text': 'TGV exhibition', 'type': 'Events', 'start': 0, 'end': 14},
        
        # Teresa Murak annotations
        {'item_idx': 1, 'text': 'Teresa Murak', 'type': 'Entity', 'start': 0, 'end': 12},
        {'item_idx': 1, 'text': '1974-1978', 'type': 'Period', 'start': 0, 'end': 9},
        {'item_idx': 1, 'text': 'Polish', 'type': 'Place', 'start': 15, 'end': 21},
        {'item_idx': 1, 'text': 'performance art', 'type': 'Terms', 'start': 60, 'end': 75},
        {'item_idx': 1, 'text': 'Eastern Europe', 'type': 'Place', 'start': 180, 'end': 194},
        
        # Rosa te Velde annotations
        {'item_idx': 2, 'text': 'Rosa te Velde', 'type': 'Entity', 'start': 0, 'end': 13},
        {'item_idx': 2, 'text': 'architecture', 'type': 'Terms', 'start': 50, 'end': 62},
        {'item_idx': 2, 'text': 'memory', 'type': 'Terms', 'start': 64, 'end': 70},
        
        # WEST SIDE TORI'S annotations
        {'item_idx': 3, 'text': 'WEST SIDE TORI\'S', 'type': 'Objects', 'start': 0, 'end': 16},
        {'item_idx': 3, 'text': 'april 2024', 'type': 'Period', 'start': 27, 'end': 37},
        {'item_idx': 3, 'text': 'Amsterdam', 'type': 'Place', 'start': 120, 'end': 129},
        
        # Matt Mullican annotations
        {'item_idx': 4, 'text': 'Matt Mullican', 'type': 'Entity', 'start': 0, 'end': 13},
        {'item_idx': 4, 'text': 'MIT Project', 'type': 'Objects', 'start': 17, 'end': 28},
        {'item_idx': 4, 'text': 'consciousness', 'type': 'Terms', 'start': 80, 'end': 93},
        
        # Decolonial Futures annotations
        {'item_idx': 6, 'text': 'Decolonial Futures', 'type': 'Events', 'start': 0, 'end': 18},
        {'item_idx': 6, 'text': 'Sandberg Instituut', 'type': 'Entity', 'start': 80, 'end': 98},
        {'item_idx': 6, 'text': 'Amsterdam', 'type': 'Place', 'start': 140, 'end': 149},
        {'item_idx': 6, 'text': 'Soweto, South Africa', 'type': 'Place', 'start': 190, 'end': 210},
    ]
    
    for ann_data in annotations_data:
        item = items[ann_data['item_idx']]
        annotation = Annotation(
            item_id=item.id,
            text=ann_data['text'],
            start_pos=ann_data['start'],
            end_pos=ann_data['end'],
            annotation_type=ann_data['type'],
            confidence=random.uniform(0.8, 1.0),
            created_by='system'
        )
        db.session.add(annotation)
    
    db.session.commit()
    
    # Create connections between items
    connections_data = [
        # Connect Matt Mullican items
        {'source_idx': 4, 'target_idx': 5, 'type': 'semantic', 'strength': 0.9},
        
        # Connect Don van Vliet and Teresa Murak (both artists from similar period)
        {'source_idx': 0, 'target_idx': 1, 'type': 'temporal', 'strength': 0.7},
        
        # Connect Decolonial Futures with other educational/institutional items
        {'source_idx': 6, 'target_idx': 7, 'type': 'institutional', 'strength': 0.8},
        
        # Connect Rosa te Velde with architectural themes
        {'source_idx': 2, 'target_idx': 3, 'type': 'thematic', 'strength': 0.6},
    ]
    
    for conn_data in connections_data:
        source_item = items[conn_data['source_idx']]
        target_item = items[conn_data['target_idx']]
        
        connection = ItemConnection(
            source_id=source_item.id,
            target_id=target_item.id,
            connection_type=conn_data['type'],
            strength=conn_data['strength'],
            properties='{"auto_generated": true}'
        )
        db.session.add(connection)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Database seeded successfully',
        'archives_created': len(archives),
        'items_created': len(items),
        'annotations_created': len(annotations_data),
        'connections_created': len(connections_data)
    })

