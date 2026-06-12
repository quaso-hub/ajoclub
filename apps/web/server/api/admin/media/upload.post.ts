export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const body = await readBody<{
    storageKey?: string
    url?: string
    alt?: string
    mimeType?: string
    width?: number
    height?: number
    source?: string
  }>(event)

  if (!body.storageKey || !body.url || !body.alt) {
    throw createError({ statusCode: 400, message: 'storageKey, url, and alt are required' })
  }

  const media = await prisma.mediaAsset.create({
    data: {
      storageKey: body.storageKey,
      url: body.url,
      alt: body.alt,
      mimeType: body.mimeType,
      width: body.width,
      height: body.height,
      source: body.source || 'INTERNAL_DEMO',
    },
  })

  return {
    media,
    note: 'Supabase Storage signed upload can replace this direct metadata endpoint when production credentials are configured.',
  }
})
