# Institution Profile Page - Facebook-like Design

## Overview

The Institution Profile Page is a comprehensive, Facebook-like profile system for educational institutions. It provides a modern, interactive interface for institutions to showcase their information, courses, ratings, and reviews.

## Features

### 🎨 Visual Design
- **Cover Photo**: Large header image with gradient fallback
- **Profile Picture**: Circular avatar with edit functionality
- **Card-based Layout**: Clean, modern card design for different sections
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color Scheme**: Consistent with the app's #640101 theme

### 👤 Profile Information
- Institution name and email
- Description/About section
- Contact information (phone, address, website)
- Established year
- Real-time student count
- Average rating and review count

### ⭐ Rating & Review System
- 5-star rating system
- Public review submission
- Review display with user names and comments
- Automatic rating calculation
- Review timestamps

### 📚 Course Management
- Course cards with images
- Course details (name, description, duration, level, price)
- Course creation and editing for institution owners
- Visual course catalog

### 📊 Statistics Dashboard
- Total enrolled students
- Average rating display
- Number of courses offered
- Interactive statistics cards

### 🖼️ Photo Upload System
Two upload methods for both cover and profile photos:
1. **URL Upload**: Direct image URL input
2. **Device Upload**: File selection from device

### 🔐 Permission System
- **Public View**: Anyone can view profile, courses, and reviews
- **Institution Owner**: Can edit profile, add courses, update photos
- **Visitors**: Can write reviews and view all information

## Technical Implementation

### Backend (FastAPI)

#### New Database Models
```python
# User model extensions
class User(Base):
    # ... existing fields ...
    cover_photo = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    established_year = Column(Integer, nullable=True)
    total_rating = Column(Integer, default=0)
    rating_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)

# Review model
class Review(Base):
    id = Column(UUID, primary_key=True)
    institution_id = Column(UUID, ForeignKey("users.id"))
    reviewer_name = Column(String(255), nullable=False)
    reviewer_email = Column(String(255), nullable=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)

# Course model
class Course(Base):
    id = Column(UUID, primary_key=True)
    institution_id = Column(UUID, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(String(100), nullable=True)
    level = Column(String(50), nullable=True)
    price = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
```

#### API Endpoints

##### Institution Profile
- `GET /api/institutions/{institution_id}/profile` - Get institution profile (public)
- `PUT /api/institutions/profile` - Update institution profile (owner only)

##### Reviews
- `GET /api/institutions/{institution_id}/reviews` - Get all reviews
- `POST /api/reviews` - Create new review (public)

##### Courses
- `GET /api/institutions/{institution_id}/courses` - Get institution courses
- `POST /api/courses` - Create new course (owner only)
- `PUT /api/courses/{course_id}` - Update course (owner only)
- `DELETE /api/courses/{course_id}` - Delete course (owner only)

### Frontend (React + Chakra UI)

#### Component Structure
```
InstitutionProfile/
├── Cover Photo Section
│   ├── Background image/gradient
│   ├── Edit button (owner only)
│   └── Profile info overlay
├── Action Buttons
│   ├── Edit Profile (owner only)
│   ├── Add Course (owner only)
│   └── Write Review (public)
├── Main Content (Left Side)
│   ├── About Section
│   │   ├── Description
│   │   └── Contact information
│   └── Courses Section
│       └── Course cards grid
└── Sidebar (Right Side)
    ├── Statistics Card
    │   ├── Student count
    │   ├── Average rating
    │   └── Course count
    └── Reviews Section
        └── Recent reviews list
```

#### Key Features Implementation

##### Photo Upload Modal
```javascript
<Tabs variant="enclosed">
  <TabList>
    <Tab>From URL</Tab>
    <Tab>From Device</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Input placeholder="Enter image URL" />
    </TabPanel>
    <TabPanel>
      <Input type="file" accept="image/*" />
    </TabPanel>
  </TabPanels>
</Tabs>
```

##### Star Rating Display
```javascript
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Icon
      key={i}
      as={FaStar}
      color={i < rating ? 'yellow.400' : 'gray.300'}
    />
  ));
};
```

##### Responsive Course Grid
```javascript
<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
  {courses.map((course) => (
    <Card key={course.id}>
      {/* Course content */}
    </Card>
  ))}
</SimpleGrid>
```

## Usage

### For Institution Owners

1. **Access Profile**: Navigate to `/institution-profile/{your-institution-id}`
2. **Edit Profile**: Click "Edit Profile" to update information
3. **Update Photos**: 
   - Click edit icon on cover photo or profile picture
   - Choose URL or device upload
   - Enter image URL or select file
4. **Add Courses**:
   - Click "Add Course" button
   - Fill in course details
   - Add course image URL
5. **View Statistics**: Monitor student count, ratings, and course performance

### For Visitors

1. **View Profile**: Navigate to any institution's profile page
2. **Browse Courses**: Scroll through offered courses
3. **Read Reviews**: Check what others say about the institution
4. **Write Review**:
   - Click "Write Review" button
   - Enter name, rating (1-5 stars), and comment
   - Submit review

## File Structure

### Backend Files
- `lms-backend/app/models.py` - Database models
- `lms-backend/app/schemas.py` - Pydantic schemas
- `lms-backend/app/main.py` - API endpoints

### Frontend Files
- `lms-project/frontend/src/pages/InstitutionProfile.js` - Main component
- `lms-project/frontend/src/App.js` - Route configuration
- `lms-project/frontend/src/components/InstitutionSidebar.js` - Navigation link

## API Usage Examples

### Get Institution Profile
```bash
curl -X GET "http://localhost:5001/api/institutions/{institution_id}/profile"
```

### Create Review
```bash
curl -X POST "http://localhost:5001/api/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "institution_id": "uuid-here",
    "reviewer_name": "John Doe",
    "rating": 5,
    "comment": "Great institution!"
  }'
```

### Update Institution Profile (Authenticated)
```bash
curl -X PUT "http://localhost:5001/api/institutions/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "description": "Updated description",
    "cover_photo": "https://example.com/cover.jpg"
  }'
```

## Styling

The profile page uses a Facebook-inspired design with:
- Clean white cards on gray background
- Consistent spacing and typography
- Hover effects and smooth transitions
- Professional color scheme
- Mobile-responsive layout

## Future Enhancements

1. **Image Upload Service**: Integrate with AWS S3 or similar for actual file uploads
2. **Review Moderation**: Admin panel for managing reviews
3. **Course Enrollment**: Direct enrollment from course cards
4. **Social Features**: Follow institutions, share profiles
5. **Analytics Dashboard**: Detailed statistics for institution owners
6. **Verified Reviews**: Email verification for reviewers
7. **Rich Text Editor**: For course descriptions and institution bio
8. **Photo Gallery**: Multiple photos for institutions and courses

## Testing

1. Start the backend: `cd lms-backend && uvicorn app.main:app --reload --port 5001`
2. Start the frontend: `cd lms-project/frontend && npm start`
3. Navigate to `/institution-profile/{institution-id}` in your browser
4. Test all features as both owner and visitor

The institution profile page provides a comprehensive, professional presence for educational institutions while maintaining ease of use and modern design standards. 