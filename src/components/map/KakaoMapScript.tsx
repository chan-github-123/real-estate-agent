'use client'

import Script from 'next/script'

export function KakaoMapScript() {
  const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY

  if (!KAKAO_APP_KEY) {
    console.warn('NEXT_PUBLIC_KAKAO_APP_KEY is not defined')
    return null
  }

  return (
    <Script
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`}
      strategy="beforeInteractive"
      onLoad={() => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('Kakao Maps loaded successfully')
          })
        }
      }}
    />
  )
}
