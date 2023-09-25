
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNMlTextOverlaySpec.h"

@interface MlTextOverlay : NSObject <NativeMlTextOverlaySpec>
#else
#import <React/RCTBridgeModule.h>

@interface MlTextOverlay : NSObject <RCTBridgeModule>
#endif

@end
