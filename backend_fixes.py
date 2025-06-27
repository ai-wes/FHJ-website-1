# Flask Backend Fixes for FHJ
# This file contains the improved code for upload and display logic

# 1. IMPROVED FILE UPLOAD ENDPOINT
"""
@app.route("/api/upload", methods=["POST"])
def upload_file():
    '''Enhanced upload with better validation and error handling'''
    
    # Check for files in request
    if 'files' not in request.files and 'file' not in request.files:
        return jsonify({"error": "No files provided"}), 400

    # Handle both single and multiple file uploads
    files = request.files.getlist('files') if 'files' in request.files else [request.files.get('file')]
    
    # Additional context from form data
    article_id = request.form.get('article_id')
    upload_type = request.form.get('type', 'general')  # 'cover_image', 'attachment', 'general'
    
    if not files or all(file.filename == '' for file in files):
        return jsonify({"error": "No files selected"}), 400

    uploaded_files = []
    errors = []

    for file in files:
        if file and file.filename:
            # Enhanced file validation
            if not allowed_file(file.filename):
                errors.append({
                    "filename": file.filename,
                    "error": f"File type not allowed. Allowed types: {', '.join(sum(ALLOWED_EXTENSIONS.values(), []))}"
                })
                continue
            
            # Check file size
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            
            if file_size > app.config['MAX_CONTENT_LENGTH']:
                errors.append({
                    "filename": file.filename,
                    "error": f"File too large. Maximum size: {app.config['MAX_CONTENT_LENGTH'] // (1024*1024)}MB"
                })
                continue

            try:
                # Generate secure filename with metadata
                original_filename = secure_filename(file.filename)
                file_extension = original_filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}_{int(datetime.now().timestamp())}.{file_extension}"
                
                file_type = get_file_type(original_filename)
                
                # Create organized directory structure
                date_folder = datetime.now().strftime("%Y/%m/%d")
                type_folder = UPLOAD_FOLDER / file_type / date_folder
                type_folder.mkdir(parents=True, exist_ok=True)
                
                file_path = type_folder / unique_filename
                
                # Save the file with metadata
                file.save(str(file_path))
                
                # Generate optimized URLs
                file_url = f"/static/uploads/{file_type}/{date_folder}/{unique_filename}"
                cdn_url = f"/api/media/{file_type}/{date_folder}/{unique_filename}"  # For CDN integration
                
                # Create thumbnail for images
                thumbnail_url = None
                if file_type == 'images':
                    thumbnail_url = create_thumbnail(file_path, unique_filename)
                
                # Extract metadata
                metadata = extract_file_metadata(file_path, file_type)
                
                file_info = {
                    "id": uuid.uuid4().hex,
                    "original_name": original_filename,
                    "filename": unique_filename,
                    "file_type": file_type,
                    "file_size": file_size,
                    "human_size": format_file_size(file_size),
                    "url": file_url,
                    "cdn_url": cdn_url,
                    "thumbnail_url": thumbnail_url,
                    "uploaded_at": datetime.now(timezone.utc).isoformat(),
                    "mime_type": file.content_type,
                    "metadata": metadata,
                    "upload_type": upload_type,
                    "article_id": article_id
                }
                
                # Store file info in database
                if article_id and upload_type == 'cover_image':
                    # Update article with cover image
                    update_article_cover_image(article_id, file_url)
                elif article_id and upload_type == 'attachment':
                    # Add to article attachments
                    add_article_attachment(article_id, file_info)
                
                uploaded_files.append(file_info)
                app.logger.info(f"File uploaded successfully: {file_url}")
                
            except Exception as e:
                app.logger.error(f"Error uploading file {file.filename}: {e}")
                errors.append({
                    "filename": file.filename,
                    "error": f"Upload failed: {str(e)}"
                })

    response = {
        "success": len(uploaded_files) > 0,
        "uploaded": len(uploaded_files),
        "failed": len(errors),
        "files": uploaded_files,
        "errors": errors if errors else None
    }
    
    status_code = 201 if uploaded_files else 400
    return jsonify(response), status_code
"""

# 2. ENHANCED ARTICLE CREATION WITH VALIDATION
"""
@app.route("/articles", methods=["POST"])
def create_article():
    '''Create article with enhanced validation and auto-save'''
    
    data = request.get_json()
    app.logger.info(f"Creating new article with data: {data.get('title', 'Untitled')}")

    # Get database collections
    db, articles_col, signups_col, projects_col = get_collections()

    # Enhanced validation
    errors = validate_article_data(data)
    if errors:
        return jsonify({"error": "Validation failed", "errors": errors}), 400

    # Generate enhanced metadata
    now_utc = datetime.now(timezone.utc)
    
    # Smart slug generation with collision detection
    base_slug = generate_slug(data.get("title", ""))
    slug = ensure_unique_slug(base_slug, articles_col)
    
    # Auto-generate excerpt if not provided
    excerpt = data.get("excerpt")
    if not excerpt and data.get("content"):
        excerpt = generate_excerpt(data["content"], max_length=160)
    
    # Calculate reading time if not provided
    reading_time = data.get("reading_time")
    if not reading_time and data.get("content"):
        reading_time = calculate_reading_time(data["content"])
    
    # Process and validate cover image
    cover_image = data.get("cover_image")
    if cover_image:
        cover_image = validate_and_process_image_url(cover_image)
    
    article_doc = {
        "title": data.get("title"),
        "content": data.get("content"),
        "author": data.get("author", "Future Human Labs"),
        "slug": slug,
        "excerpt": excerpt,
        "cover_image": cover_image,
        "category": data.get("category"),
        "topics": data.get("topics", []),
        "tags": normalize_tags(data.get("tags", [])),
        "author_image": data.get("author_image"),
        "date": data.get("date", now_utc.strftime("%Y-%m-%d")),
        "reading_time": reading_time,
        "created_at": now_utc,
        "updated_at": now_utc,
        "status": data.get("status", "draft"),
        "scheduled_date": parse_date(data.get("scheduled_date")),
        "published_date": parse_date(data.get("published_date")),
        "view_count": 0,
        "likes": 0,
        "shares": 0,
        "comments_count": 0,
        "platforms_published": data.get("platforms_published", []),
        "priority": data.get("priority", "medium"),
        "assignee": data.get("assignee"),
        "due_date": parse_date(data.get("due_date")),
        "content_type": data.get("content_type", "blog_post"),
        "workflow_stage": data.get("workflow_stage", "draft"),
        "attachments": data.get("attachments", []),
        "version": 1,
        "revision_history": [],
        "is_featured": data.get("is_featured", False),
        "seo_keywords": data.get("seo_keywords", []),
        "meta_description": data.get("meta_description", excerpt),
        "ai_generated": data.get("ai_generated", False),
        "word_count": count_words(data.get("content", "")),
        "language": detect_language(data.get("content", "")),
        "sentiment": analyze_sentiment(data.get("content", "")),
    }
    
    # Add auto-save functionality
    if data.get("auto_save"):
        article_doc["auto_save"] = {
            "enabled": True,
            "last_saved": now_utc,
            "version": 1
        }

    try:
        result = articles_col.insert_one(article_doc)
        app.logger.info(f"Article created with ID: {result.inserted_id}")
        
        # Create initial revision
        create_revision(result.inserted_id, article_doc, "Initial creation")
        
        # Trigger post-creation tasks
        if article_doc["status"] == "published":
            trigger_publish_tasks(result.inserted_id)
        
        created_article = articles_col.find_one({"_id": result.inserted_id})
        
        return jsonify({
            "success": True,
            "article": serialize_article(created_article),
            "message": "Article created successfully"
        }), 201

    except Exception as e:
        app.logger.error(f"Error creating article: {e}")
        return jsonify({"error": "Failed to create article", "details": str(e)}), 500
"""

# 3. ENHANCED ARTICLE DISPLAY WITH FILTERING
"""
@app.route("/articles", methods=["GET"])
def get_articles():
    '''Get articles with advanced filtering and pagination'''
    
    app.logger.info("Fetching articles with filters")
    
    # Get database collections
    db, articles_col, signups_col, projects_col = get_collections()
    
    if articles_col is None:
        return jsonify({"error": "Database connection not available"}), 500
    
    # Enhanced query parameters
    search = request.args.get("search", "")
    category = request.args.get("category")
    tags = request.args.getlist("tags")  # Multiple tags
    topics = request.args.getlist("topics")  # Multiple topics
    author = request.args.get("author")
    status = request.args.get("status", "published")  # Default to published only
    date_from = request.args.get("date_from")
    date_to = request.args.get("date_to")
    sort_by = request.args.get("sort_by", "date")  # date, views, likes, title
    sort_order = request.args.get("sort_order", "desc")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 12))
    featured_only = request.args.get("featured", "false").lower() == "true"
    
    # Build advanced query
    query = {}
    
    # Status filter (allow 'all' to see everything)
    if status != "all":
        query["status"] = status
    
    # Text search across multiple fields
    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"title": search_regex},
            {"excerpt": search_regex},
            {"content": search_regex},
            {"tags": search_regex},
            {"seo_keywords": search_regex}
        ]
    
    # Category filter
    if category:
        query["category"] = category
    
    # Tags filter (match any)
    if tags:
        query["tags"] = {"$in": tags}
    
    # Topics filter (match any)
    if topics:
        query["topics"] = {"$in": topics}
    
    # Author filter
    if author:
        query["author"] = author
    
    # Date range filter
    if date_from or date_to:
        date_query = {}
        if date_from:
            date_query["$gte"] = date_from
        if date_to:
            date_query["$lte"] = date_to
        query["date"] = date_query
    
    # Featured filter
    if featured_only:
        query["is_featured"] = True
    
    # Sorting options
    sort_options = {
        "date": ("date", -1 if sort_order == "desc" else 1),
        "views": ("view_count", -1 if sort_order == "desc" else 1),
        "likes": ("likes", -1 if sort_order == "desc" else 1),
        "title": ("title", 1 if sort_order == "asc" else -1),
        "updated": ("updated_at", -1 if sort_order == "desc" else 1)
    }
    
    sort_field, sort_direction = sort_options.get(sort_by, ("date", -1))
    
    try:
        # Get total count for pagination
        total = articles_col.count_documents(query)
        
        # Calculate pagination metadata
        total_pages = (total + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        # Fetch articles with pagination
        articles_cursor = (
            articles_col.find(query)
            .sort(sort_field, sort_direction)
            .skip((page - 1) * limit)
            .limit(limit)
        )
        
        articles = []
        for article in articles_cursor:
            serialized = serialize_article(article)
            # Add interaction counts
            serialized["interactions"] = {
                "views": article.get("view_count", 0),
                "likes": article.get("likes", 0),
                "shares": article.get("shares", 0),
                "comments": article.get("comments_count", 0)
            }
            articles.append(serialized)
        
        # Get aggregate data for filters
        aggregates = get_article_aggregates(articles_col, query)
        
        response = {
            "success": True,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
            "has_next": has_next,
            "has_prev": has_prev,
            "articles": articles,
            "filters": {
                "categories": aggregates.get("categories", []),
                "tags": aggregates.get("tags", []),
                "topics": aggregates.get("topics", []),
                "authors": aggregates.get("authors", [])
            }
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching articles: {e}")
        return jsonify({"error": "Failed to fetch articles", "details": str(e)}), 500
"""

# 4. ARTICLE INTERACTIONS ENDPOINT
"""
@app.route("/articles/<article_id>/interact", methods=["POST"])
def article_interaction(article_id):
    '''Handle article interactions (views, likes, shares)'''
    
    data = request.get_json()
    interaction_type = data.get("type")  # view, like, share, comment
    user_id = data.get("user_id")  # Optional user tracking
    
    if interaction_type not in ["view", "like", "share", "unlike"]:
        return jsonify({"error": "Invalid interaction type"}), 400
    
    try:
        obj_id = ObjectId(article_id)
    except Exception:
        return jsonify({"error": "Invalid article ID"}), 400
    
    db, articles_col, _, _ = get_collections()
    
    article = articles_col.find_one({"_id": obj_id})
    if not article:
        return jsonify({"error": "Article not found"}), 404
    
    try:
        update_doc = {}
        
        if interaction_type == "view":
            update_doc = {"$inc": {"view_count": 1}}
            # Track unique views if user_id provided
            if user_id:
                update_doc["$addToSet"] = {"unique_viewers": user_id}
                
        elif interaction_type == "like":
            update_doc = {"$inc": {"likes": 1}}
            if user_id:
                update_doc["$addToSet"] = {"liked_by": user_id}
                
        elif interaction_type == "unlike":
            update_doc = {"$inc": {"likes": -1}}
            if user_id:
                update_doc["$pull"] = {"liked_by": user_id}
                
        elif interaction_type == "share":
            update_doc = {"$inc": {"shares": 1}}
            platform = data.get("platform", "unknown")
            update_doc["$push"] = {
                "share_history": {
                    "user_id": user_id,
                    "platform": platform,
                    "timestamp": datetime.now(timezone.utc)
                }
            }
        
        # Update interaction timestamp
        update_doc["$set"] = {"last_interaction": datetime.now(timezone.utc)}
        
        articles_col.update_one({"_id": obj_id}, update_doc)
        
        # Get updated counts
        updated_article = articles_col.find_one(
            {"_id": obj_id},
            {"view_count": 1, "likes": 1, "shares": 1, "comments_count": 1}
        )
        
        return jsonify({
            "success": True,
            "interaction": interaction_type,
            "counts": {
                "views": updated_article.get("view_count", 0),
                "likes": updated_article.get("likes", 0),
                "shares": updated_article.get("shares", 0),
                "comments": updated_article.get("comments_count", 0)
            }
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error processing interaction: {e}")
        return jsonify({"error": "Failed to process interaction"}), 500
"""

# 5. HELPER FUNCTIONS
"""
def validate_article_data(data):
    '''Validate article data and return errors'''
    errors = []
    
    if not data.get("title"):
        errors.append({"field": "title", "message": "Title is required"})
    elif len(data["title"]) > 200:
        errors.append({"field": "title", "message": "Title must be less than 200 characters"})
    
    if not data.get("content"):
        errors.append({"field": "content", "message": "Content is required"})
    elif len(data["content"]) < 100:
        errors.append({"field": "content", "message": "Content must be at least 100 characters"})
    
    if data.get("category") and data["category"] not in VALID_CATEGORIES:
        errors.append({"field": "category", "message": f"Invalid category. Valid options: {', '.join(VALID_CATEGORIES)}"})
    
    return errors

def generate_slug(title):
    '''Generate URL-friendly slug from title'''
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def ensure_unique_slug(base_slug, collection):
    '''Ensure slug is unique by appending number if needed'''
    slug = base_slug
    counter = 1
    
    while collection.find_one({"slug": slug}):
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug

def generate_excerpt(content, max_length=160):
    '''Generate excerpt from content'''
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', '', content)
    # Get first paragraph or max_length characters
    excerpt = text[:max_length]
    if len(text) > max_length:
        excerpt = excerpt.rsplit(' ', 1)[0] + '...'
    return excerpt

def calculate_reading_time(content):
    '''Calculate estimated reading time'''
    words = len(content.split())
    minutes = max(1, round(words / 200))  # Average 200 words per minute
    return f"{minutes} min read"

def count_words(content):
    '''Count words in content'''
    text = re.sub(r'<[^>]+>', '', content)
    return len(text.split())

def normalize_tags(tags):
    '''Normalize tags to lowercase and remove duplicates'''
    return list(set(tag.lower().strip() for tag in tags if tag.strip()))

def create_thumbnail(file_path, filename):
    '''Create thumbnail for image files'''
    try:
        from PIL import Image
        
        img = Image.open(file_path)
        img.thumbnail((300, 300), Image.Resampling.LANCZOS)
        
        thumb_filename = f"thumb_{filename}"
        thumb_path = file_path.parent / thumb_filename
        img.save(thumb_path, optimize=True, quality=85)
        
        return f"/static/uploads/images/thumbnails/{thumb_filename}"
    except Exception as e:
        app.logger.error(f"Error creating thumbnail: {e}")
        return None

def extract_file_metadata(file_path, file_type):
    '''Extract metadata from uploaded files'''
    metadata = {}
    
    try:
        if file_type == 'images':
            from PIL import Image
            img = Image.open(file_path)
            metadata = {
                "width": img.width,
                "height": img.height,
                "format": img.format,
                "mode": img.mode
            }
    except Exception as e:
        app.logger.error(f"Error extracting metadata: {e}")
    
    return metadata

def format_file_size(size_bytes):
    '''Format file size in human readable format'''
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def get_article_aggregates(collection, base_query):
    '''Get aggregate data for filters'''
    pipeline = [
        {"$match": base_query},
        {"$facet": {
            "categories": [
                {"$group": {"_id": "$category", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ],
            "tags": [
                {"$unwind": "$tags"},
                {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 20}
            ],
            "topics": [
                {"$unwind": "$topics"},
                {"$group": {"_id": "$topics", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 20}
            ],
            "authors": [
                {"$group": {"_id": "$author", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ]
        }}
    ]
    
    result = list(collection.aggregate(pipeline))
    if result:
        return result[0]
    return {}

# Add these constants to your app.py
VALID_CATEGORIES = [
    "Technology", "AI & Machine Learning", "Future Trends", 
    "Digital Transformation", "Innovation", "Research", 
    "Opinion", "Tutorial", "Case Study", "News"
]
"""