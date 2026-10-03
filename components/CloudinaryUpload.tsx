'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

type Props = {
  title: string;
  description: string;
  resourceType: 'video' | 'image';
  projectId: string;
  onUploaded: (asset: {
    publicId: string;
    secureUrl: string;
    resourceType: 'video' | 'image' | 'raw';
    format?: string;
    width?: number;
    height?: number;
    duration?: number;
    createdAt?: string;
    label?: string;
  }) => void;
};

export function CloudinaryUpload({
  title,
  description,
  resourceType,
  projectId,
  onUploaded,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    return (
      <div className="uploadBox">
        <div>
          <strong>{title}</strong>
          <p>
            Add <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{' '}
            <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> to{' '}
            <code>.env.local</code> to enable uploads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CldUploadWidget
        uploadPreset={preset}
        options={{
          cloudName,
          resourceType,
          multiple: false,
          maxFileSize:
            resourceType === 'video' ? 50_000_000 : 10_000_000,
          sources: ['local', 'camera'],
          folder: `skillproof/${projectId}`,
          tags: [
            'skillproof',
            resourceType === 'video'
              ? 'project-demo'
              : 'project-evidence',
          ],
          context: {
            project_id: projectId,
            product: 'skillproof',
          },
        }}
        onSuccess={(result) => {
          setError(null);

          if (typeof result?.info === 'string' || !result?.info) {
            return;
          }

          const info = result.info as unknown as Record<string, unknown>;

          const asset = {
            publicId: String(info.public_id ?? ''),
            secureUrl: String(info.secure_url ?? ''),
            resourceType:
              (info.resource_type as 'video' | 'image' | 'raw') ??
              resourceType,
            format:
              typeof info.format === 'string'
                ? info.format
                : undefined,
            width:
              typeof info.width === 'number'
                ? info.width
                : undefined,
            height:
              typeof info.height === 'number'
                ? info.height
                : undefined,
            duration:
              typeof info.duration === 'number'
                ? info.duration
                : undefined,
            createdAt:
              typeof info.created_at === 'string'
                ? info.created_at
                : undefined,
            label:
              resourceType === 'video'
                ? 'project-demo'
                : 'project-evidence',
          };

          console.log('CLOUDINARY UPLOAD SUCCESS:', asset);

          setUploaded(true);
          onUploaded(asset);
        }}
        onError={(uploadError) => {
          console.error('CLOUDINARY UPLOAD ERROR:', uploadError);
          console.error(
            'CLOUDINARY UPLOAD ERROR JSON:',
            JSON.stringify(uploadError, Object.getOwnPropertyNames(uploadError))
          );

          let message = 'Cloudinary upload failed.';

          if (typeof uploadError === 'string') {
            message = uploadError;
          } else if (uploadError instanceof Error) {
            message = uploadError.message;
          } else if (
            typeof uploadError === 'object' &&
            uploadError !== null &&
            'message' in uploadError
          ) {
            message = String(uploadError.message);
          } else if (uploadError) {
            message = JSON.stringify(
              uploadError,
              Object.getOwnPropertyNames(uploadError)
            );
          }

          setError(message);
          setUploaded(false);
        }}
      >
        {({ open }) => (
          <div className="uploadBox">
            <div>
              <strong>{title}</strong>
              <p>{description}</p>

              <button
                className="btn"
                type="button"
                onClick={() => {
                  setError(null);
                  setUploaded(false);
                  open();
                }}
              >
                Upload to Cloudinary
              </button>
            </div>
          </div>
        )}
      </CldUploadWidget>

      {uploaded && (
        <div className="success" style={{ marginTop: 10 }}>
          ✅ Upload completed successfully.
        </div>
      )}

      {error && (
        <div
          className="notice"
          style={{
            marginTop: 10,
            borderColor: '#ef4444',
          }}
        >
          <strong>Cloudinary upload error</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}