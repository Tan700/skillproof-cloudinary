# Deploy SkillProof

## Vercel

1. Push the repository to a public GitHub repository.
2. Import the repository into Vercel.
3. Add these environment variables in the Vercel project settings:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

4. Deploy.
5. Open `/dashboard` on the deployed URL and perform a real Cloudinary upload.
6. Open the generated project proof page and verify the video/image loads.

## Before sharing the demo URL

- Make sure at least one upload works from the deployed domain.
- Use a small 20–40 second video for the judge demo.
- Verify no secrets are present in the repository or client-side code.
- Add the final live URL to `README.md`.
