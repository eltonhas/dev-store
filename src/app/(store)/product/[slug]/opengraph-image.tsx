import { ImageResponse } from 'next/server'
import colors from 'tailwindcss/colors'
import { env } from '@/env'
import { Products } from '@/data/@types/products'
import { api } from '@/data/api'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = ''
export const size = {
  width: 1200,
  height: 630,
}

interface ParamsProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string): Promise<Products> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })

  const product = await response.json()

  return product
}

export const contentType = 'image/png'

export default async function OgImage({ params }: ParamsProps) {
  const product = await getProduct(params.slug)
  const productImageURL = new URL(product.image, env.APP_URL).toString()

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: colors.zinc[950],
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img src={productImageURL} alt="" style={{ width: '100%' }} />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    },
  )
}
