# Test Fixtures

This directory contains test files used by E2E tests.

## Required Files

### For Catalog Tests
- **test-menu.jpg**: Sample menu image (any JPG image, recommended size: 800x600px)
  - Used in: `tests/e2e/admin/catalogs.spec.ts`
  - Purpose: Testing catalog creation with images

### For Video Ad Tests
- **test-video.mp4**: Sample video file
  - Duration: Between 1-60 seconds
  - Size: Less than 100MB
  - Format: MP4, WebM, or other video formats
  - Used in: `tests/e2e/admin/video-ads.spec.ts`
  - Purpose: Testing video ad upload and creation

### For Validation Tests
- **test-image.jpg**: General test image
  - Used for: Testing invalid file type validation in video uploads
  - Any JPG image will work

### For Image Limit Tests (Optional)
- **test-image-0.jpg** through **test-image-10.jpg**: Multiple images
  - Purpose: Testing maximum 10 images per catalog validation
  - Can be copies of the same image with different names

## Creating Test Fixtures

If you don't have these files, you can create them:

### Create a Test Image
```bash
# On macOS/Linux with ImageMagick
convert -size 800x600 xc:white -pointsize 72 -draw "text 200,300 'Test Menu'" test-menu.jpg

# Or just copy any existing image
cp ~/Pictures/sample.jpg tests/fixtures/test-menu.jpg
```

### Create a Test Video
```bash
# On macOS/Linux with ffmpeg
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 -pix_fmt yuv420p tests/fixtures/test-video.mp4

# Or record a short video with your camera and save it here
```

### Quick Setup with Placeholders
```bash
cd tests/fixtures

# Create dummy image files (won't actually work for uploads, but prevents errors)
touch test-menu.jpg test-image.jpg

# Create dummy video
touch test-video.mp4

# Create multiple test images
for i in {0..10}; do touch test-image-$i.jpg; done
```

## Notes

- Tests will gracefully skip file upload scenarios if fixtures are not available
- For CI/CD pipelines, fixtures should be committed to the repository
- Keep file sizes reasonable to avoid slow test runs
- Ensure test files don't contain sensitive information

## .gitignore

If you don't want to commit test fixtures:

```
# Add to .gitignore
tests/fixtures/*.jpg
tests/fixtures/*.mp4
tests/fixtures/*.png
!tests/fixtures/README.md
```

## Downloading Sample Fixtures

You can download free test media from:

- **Images**: [Unsplash](https://unsplash.com) - Free stock photos
- **Videos**: [Pexels Videos](https://www.pexels.com/videos/) - Free stock videos

Make sure downloaded files meet the requirements listed above.
