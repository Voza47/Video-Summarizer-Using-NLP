import React, { useEffect, useState, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
// @ts-ignore
import BIRDS from 'vanta/dist/vanta.birds.min';
// @ts-ignore
import FOG from 'vanta/dist/vanta.fog.min';
// @ts-ignore
import WAVES from 'vanta/dist/vanta.waves.min';
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

type AnimationType = 'birds' | 'fog' | 'waves' | 'net';

interface BackgroundAnimationProps {
  type?: AnimationType;
  color?: string;
  backgroundColor?: string;
  mouseControls?: boolean;
  touchControls?: boolean;
  minHeight?: number | string;
  minWidth?: number | string;
  scale?: number;
  scaleMobile?: number;
  speed?: number;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({
  type = 'birds',
  color,
  backgroundColor,
  mouseControls = true,
  touchControls = true,
  minHeight = '100vh',
  minWidth = '100vw',
  scale = 1.0,
  scaleMobile = 1.0,
  speed = 3.0,
}) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();

  // Set default colors based on color mode
  const defaultLightColor = '#ff3333';
  const defaultDarkColor = '#ff5555';
  const defaultLightBg = '#f7fafc';
  const defaultDarkBg = '#1a202c';

  // Determine colors based on color mode and props
  const effectColor = color || (colorMode === 'dark' ? defaultDarkColor : defaultLightColor);
  const effectBg = backgroundColor || (colorMode === 'dark' ? defaultDarkBg : defaultLightBg);

  useEffect(() => {
    if (!vantaEffect) {
      let vantaInstance;

      switch (type) {
        case 'birds':
          vantaInstance = BIRDS({
            el: vantaRef.current,
            THREE,
            mouseControls,
            touchControls,
            gyroControls: false,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            backgroundColor: effectBg,
            color1: effectColor,
            colorMode: 'variance',
            birdSize: 1.5,
            wingSpan: 30.0,
            speedLimit: 7.0,
            separation: 60.0,
            alignment: 40.0,
            cohesion: 40.0,
            quantity: 4.0
          });
          break;
        case 'fog':
          vantaInstance = FOG({
            el: vantaRef.current,
            THREE,
            mouseControls,
            touchControls,
            gyroControls: false,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            highlightColor: effectColor,
            midtoneColor: effectColor,
            lowlightColor: effectBg,
            baseColor: effectBg,
            blurFactor: 0.6,
            speed: speed,
            zoom: 1
          });
          break;
        case 'waves':
          vantaInstance = WAVES({
            el: vantaRef.current,
            THREE,
            mouseControls,
            touchControls,
            gyroControls: false,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            color: effectColor,
            shininess: 35,
            waveHeight: 20,
            waveSpeed: speed * 0.5,
            zoom: 0.75
          });
          break;
        case 'net':
          vantaInstance = NET({
            el: vantaRef.current,
            THREE,
            mouseControls,
            touchControls,
            gyroControls: false,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            color: effectColor,
            backgroundColor: effectBg,
            points: 10,
            maxDistance: 25,
            spacing: 20,
            showDots: false
          });
          break;
        default:
          vantaInstance = BIRDS({
            el: vantaRef.current,
            THREE,
            mouseControls,
            touchControls,
            gyroControls: false,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            backgroundColor: effectBg,
            color1: effectColor
          });
      }

      setVantaEffect(vantaInstance);
    }

    // Cleanup
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [type, colorMode]); // Re-initialize when type or color mode changes

  return (
    <Box
      ref={vantaRef}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      width="100%"
      height="100%"
      overflow="hidden"
    />
  );
};

export default BackgroundAnimation; 