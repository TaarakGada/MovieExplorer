'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    fallbackSrc: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    sizes?: string;
}

export default function ImageWithFallback({
    src,
    alt,
    fallbackSrc,
    fill,
    className,
    priority,
    sizes,
    ...rest
}: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    const handleError = () => {
        if (!error) {
            setImgSrc(fallbackSrc);
            setError(true);
        }
    };

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill={fill}
            className={className}
            priority={priority}
            sizes={sizes}
            onError={handleError}
            {...rest}
        />
    );
}
