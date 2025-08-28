const fs = require('fs');
const path = require('path');

// Simple Node.js script to save blog updates to data.json
// This would typically be part of a backend API

function saveBlogToDataJson(updatedBlog) {
  try {
    // Read the current data.json file
    const dataPath = path.join(__dirname, 'public', 'data.json');
    const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Since blogs are generated from courses, we need to find the corresponding course
    // and update its related data if needed
    
    // For now, we'll add a separate blogs array to the data structure
    if (!currentData.blogs) {
      currentData.blogs = [];
    }
    
    // Find existing blog or add new one
    const existingBlogIndex = currentData.blogs.findIndex(blog => blog.id === updatedBlog.id);
    
    if (existingBlogIndex !== -1) {
      // Update existing blog
      currentData.blogs[existingBlogIndex] = updatedBlog;
    } else {
      // Add new blog
      currentData.blogs.push(updatedBlog);
    }
    
    // Write back to data.json
    fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
    console.log(`Blog ${updatedBlog.id} saved successfully to data.json`);
    
    return true;
  } catch (error) {
    console.error('Error saving blog to data.json:', error);
    return false;
  }
}

// Example usage:
// const updatedBlog = {
//   id: 1,
//   title: "Updated Blog Title",
//   category: "Technology",
//   content: "Updated content..."
// };
// saveBlogToDataJson(updatedBlog);

module.exports = { saveBlogToDataJson };
