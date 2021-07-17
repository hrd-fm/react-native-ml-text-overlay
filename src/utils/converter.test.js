import { XYtoBoundary, cloudVisionToML } from './converter'
import cloudMLResults from '../../example/fixtures/ml_vision_cloud_results.json'
describe('converts', () => {
  it('converts XYtoBoundary to boundary', () => {
    const GMLData = {
      vertices: [
        {
          x: 41,
          y: 25,
        },
        {
          x: 937,
          y: 25,
        },
        {
          x: 937,
          y: 1371,
        },
        {
          x: 41,
          y: 1371,
        },
      ],
    }
    expect(XYtoBoundary(GMLData.vertices)).toMatchSnapshot()
  })
  it('converts cloud vision to the right format', () => {
    expect(cloudVisionToML(cloudMLResults)).toMatchSnapshot()
  })
})
