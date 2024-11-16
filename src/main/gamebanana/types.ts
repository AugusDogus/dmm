import { z } from 'zod'

export const ImageSchema = z.object({
  _sType: z.string(),
  _sBaseUrl: z.string(),
  _sFile: z.string(),
  _sFile220: z.string().optional(),
  _hFile220: z.number().optional(),
  _wFile220: z.number().optional(),
  _sFile530: z.string().optional(),
  _hFile530: z.number().optional(),
  _wFile530: z.number().optional(),
  _sFile100: z.string().optional(),
  _hFile100: z.number().optional(),
  _wFile100: z.number().optional(),
  _sFile800: z.string().optional(),
  _hFile800: z.number().optional(),
  _wFile800: z.number().optional(),
  _sCaption: z.string().optional(),
})

export const PreviewMediaSchema = z.object({
  _aImages: z.array(ImageSchema)
})

export const SubmitterSchema = z.object({
  _idRow: z.number(),
  _sName: z.string(),
  _bIsOnline: z.boolean(),
  _bHasRipe: z.boolean(),
  _sProfileUrl: z.string(),
  _sAvatarUrl: z.string(),
  _sHdAvatarUrl: z.string().optional(),
  _sUpicUrl: z.string().optional(),
})

export const GameSchema = z.object({
  _idRow: z.number(),
  _sName: z.string(),
  _sProfileUrl: z.string(),
  _sIconUrl: z.string(),
})

export const CategorySchema = z.object({
  _sName: z.string(),
  _sProfileUrl: z.string(),
  _sIconUrl: z.string(),
})

export const ModSchema = z.object({
  _idRow: z.number(),
  _sModelName: z.string(),
  _sSingularTitle: z.string(),
  _sIconClasses: z.string(),
  _sName: z.string(),
  _sProfileUrl: z.string(),
  _tsDateAdded: z.number(),
  _tsDateModified: z.number(),
  _bHasFiles: z.boolean(),
  _aTags: z.array(z.string()),
  _aPreviewMedia: PreviewMediaSchema,
  _aSubmitter: SubmitterSchema,
  _aGame: GameSchema,
  _aRootCategory: CategorySchema,
  _sVersion: z.string(),
  _tsDateUpdated: z.number().optional(),
  _bIsObsolete: z.boolean(),
  _sInitialVisibility: z.string(),
  _bHasContentRatings: z.boolean(),
  _nLikeCount: z.number().optional(),
  _nPostCount: z.number().optional(),
  _bWasFeatured: z.boolean().optional(),
  _nViewCount: z.number().optional(),
  _bIsOwnedByAccessor: z.boolean(),
})

export const ModListResponseSchema = z.object({
  _aMetadata: z.object({
    _nRecordCount: z.number(),
    _bIsComplete: z.boolean(),
    _nPerpage: z.number(),
  }),
  _aRecords: z.array(ModSchema),
})

export type Image = z.infer<typeof ImageSchema>
export type PreviewMedia = z.infer<typeof PreviewMediaSchema>
export type Submitter = z.infer<typeof SubmitterSchema>
export type Game = z.infer<typeof GameSchema>
export type Category = z.infer<typeof CategorySchema>
export type Mod = z.infer<typeof ModSchema>
export type ModListResponse = z.infer<typeof ModListResponseSchema> 