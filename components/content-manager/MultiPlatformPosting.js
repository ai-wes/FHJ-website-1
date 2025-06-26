import React, { useState, useRef } from 'react';
import './MultiPlatformPosting.css';

const MultiPlatformPosting = () => {
  // Credentials state
  const [credentials, setCredentials] = useState({
    wordpress: { username: '', password: '', url: '' },
    medium: { token: '' },
    linkedin: { accessToken: '' },
    twitter: { apiKey: '', apiSecret: '', accessToken: '', accessTokenSecret: '' }
  });

  // Content state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    media: [] // Will store media files and their metadata
  });

  // Platform selection state
  const [platforms, setPlatforms] = useState({
    wordpress: false,
    medium: false,
    linkedin: false,
    twitter: false,
  });

  const [preview, setPreview] = useState(false);

  // Ref for file input
  const fileInputRef = useRef(null);

  // Handle credential changes
  const handleCredentialChange = (platform, field, value) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  // Handle content input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle platform selection
  const handlePlatformChange = (platform) => {
    setPlatforms({ ...platforms, [platform]: !platforms[platform] });
  };

  // Handle media file selection
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Create preview URL for images and videos
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, {
          file,
          type: file.type,
          name: file.name,
          size: file.size,
          previewUrl,
          caption: ''
        }]
      }));
    });
  };

  // Handle media caption updates
  const handleCaptionChange = (index, caption) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((item, i) => 
        i === index ? { ...item, caption } : item
      )
    }));
  };

  // Handle media removal
  const handleRemoveMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  // Handle post deployment
  const handleDeploy = () => {
    const selectedPlatforms = Object.keys(platforms).filter((key) => platforms[key]);

    if (!formData.title || !formData.content) {
      alert('Please fill in the title and content.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform.');
      return;
    }

    // Here you would handle media upload and post deployment
    console.log('Deploying post with media:', formData.media);
    alert(`Deploying post "${formData.title}" with ${formData.media.length} media items to: ${selectedPlatforms.join(', ')}`);
  };

  return (
    <div className="posting-container">
      {/* Credentials Panel */}
      <div className="credentials-panel">
        <h3>Platform Credentials</h3>
        
        {/* WordPress Credentials */}
        <div className="platform-credentials">
          <h4>WordPress</h4>
          <input
            type="text"
            placeholder="WordPress URL"
            value={credentials.wordpress.url}
            onChange={(e) => handleCredentialChange('wordpress', 'url', e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={credentials.wordpress.username}
            onChange={(e) => handleCredentialChange('wordpress', 'username', e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.wordpress.password}
            onChange={(e) => handleCredentialChange('wordpress', 'password', e.target.value)}
          />
        </div>

        {/* Medium Credentials */}
        <div className="platform-credentials">
          <h4>Medium</h4>
          <input
            type="password"
            placeholder="Integration Token"
            value={credentials.medium.token}
            onChange={(e) => handleCredentialChange('medium', 'token', e.target.value)}
          />
        </div>

        {/* LinkedIn Credentials */}
        <div className="platform-credentials">
          <h4>LinkedIn</h4>
          <input
            type="password"
            placeholder="Access Token"
            value={credentials.linkedin.accessToken}
            onChange={(e) => handleCredentialChange('linkedin', 'accessToken', e.target.value)}
          />
        </div>

        {/* Twitter Credentials */}
        <div className="platform-credentials">
          <h4>Twitter</h4>
          <input
            type="password"
            placeholder="API Key"
            value={credentials.twitter.apiKey}
            onChange={(e) => handleCredentialChange('twitter', 'apiKey', e.target.value)}
          />
          <input
            type="password"
            placeholder="API Secret"
            value={credentials.twitter.apiSecret}
            onChange={(e) => handleCredentialChange('twitter', 'apiSecret', e.target.value)}
          />
          <input
            type="password"
            placeholder="Access Token"
            value={credentials.twitter.accessToken}
            onChange={(e) => handleCredentialChange('twitter', 'accessToken', e.target.value)}
          />
          <input
            type="password"
            placeholder="Access Token Secret"
            value={credentials.twitter.accessTokenSecret}
            onChange={(e) => handleCredentialChange('twitter', 'accessTokenSecret', e.target.value)}
          />
        </div>
      </div>

      {/* Content Panel */}
      <div className="content-panel">
        <h2>Create Your Post</h2>
        <div className="form-section">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your post title"
          />

          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your post content here..."
          ></textarea>

          <label>Tags (comma-separated):</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., technology, AI, innovation"
          />

          {/* Media Upload Section */}
          <div className="media-section">
            <label>Media:</label>
            <div className="media-upload-area">
              <button 
                className="upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                Add Media
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaUpload}
                accept="image/*,video/*"
                multiple
                style={{ display: 'none' }}
              />
              <span className="upload-hint">
                Supported formats: Images (JPG, PNG, GIF), Videos (MP4, WebM)
              </span>
            </div>

            {/* Media Preview Area */}
            <div className="media-preview-area">
              {formData.media.map((media, index) => (
                <div key={index} className="media-item">
                  {media.type.startsWith('image/') ? (
                    <img src={media.previewUrl} alt={media.name} />
                  ) : media.type.startsWith('video/') ? (
                    <video src={media.previewUrl} controls />
                  ) : (
                    <div className="file-preview">{media.name}</div>
                  )}
                  <input
                    type="text"
                    placeholder="Add caption..."
                    value={media.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="media-caption"
                  />
                  <button
                    className="remove-media"
                    onClick={() => handleRemoveMedia(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="platform-section">
          <h3>Select Platforms</h3>
          <div className="platforms">
            {Object.keys(platforms).map((platform) => (
              <div key={platform} className="platform">
                <label>
                  <input
                    type="checkbox"
                    checked={platforms[platform]}
                    onChange={() => handlePlatformChange(platform)}
                  />
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => setPreview(!preview)}>
            {preview ? 'Close Preview' : 'Preview Post'}
          </button>
          <button onClick={handleDeploy}>Deploy Post</button>
        </div>

        {/* Updated Preview Section */}
        {preview && (
          <div className="preview-section">
            <h2>Post Preview</h2>
            <h3>{formData.title}</h3>
            
            {/* Media Preview */}
            {formData.media.length > 0 && (
              <div className="preview-media">
                {formData.media.map((media, index) => (
                  <div key={index} className="preview-media-item">
                    {media.type.startsWith('image/') ? (
                      <img src={media.previewUrl} alt={media.caption || media.name} />
                    ) : media.type.startsWith('video/') ? (
                      <video src={media.previewUrl} controls />
                    ) : null}
                    {media.caption && <p className="media-caption">{media.caption}</p>}
                  </div>
                ))}
              </div>
            )}
            
            <p>{formData.content}</p>
            {formData.tags && (
              <p>
                <strong>Tags:</strong> {formData.tags.split(',').join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiPlatformPosting;
