import { slice } from 'ramda'
import type { MLTextOverlay, Element, Bounding, CornerPoint } from '../index'

export interface CloudMLItem {
  boundingPoly: {
    vertices: [CornerPoint, CornerPoint, CornerPoint, CornerPoint]
  }
  description: string
  locale: string
}
export interface CloudML {
  textAnnotations: CloudMLItem[]
}
export interface CloudVisionToMLOptions {
  skip?: number
}
export const cloudVisionToML = (
  cloudMLResults: CloudML,
  options: CloudVisionToMLOptions
): MLTextOverlay[] => {
  const response = options?.skip
    ? slice(options?.skip, cloudMLResults?.textAnnotations?.length, cloudMLResults?.textAnnotations)
    : cloudMLResults?.textAnnotations
  return response?.map((block: CloudMLItem) => ({
    bounding: XYtoBoundary(block.boundingPoly.vertices),
    cornerPoints: block.boundingPoly.vertices,
    text: block.description,
    locale: block.locale,
  }))
}

export const XYtoBoundary = (
  coordinates: [CornerPoint, CornerPoint, CornerPoint, CornerPoint]
): Bounding => {
  return {
    height: coordinates[2].y - coordinates[1].y,
    left: coordinates[0].x,
    top: coordinates[0].y,
    width: coordinates[1].x - coordinates[0].x,
  }
}
