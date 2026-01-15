// 매물 유형
export const PROPERTY_TYPES = {
  apartment: '아파트',
  villa: '빌라/연립',
  officetel: '오피스텔',
  house: '단독주택',
  commercial: '상가',
  office: '사무실',
  land: '토지',
} as const

// 거래 유형
export const TRANSACTION_TYPES = {
  sale: '매매',
  jeonse: '전세',
  monthly: '월세',
} as const

// 매물 상태
export const PROPERTY_STATUS = {
  available: '판매중',
  reserved: '계약중',
  completed: '거래완료',
} as const

// 문의/상담 상태
export const INQUIRY_STATUS = {
  pending: '대기중',
  in_progress: '처리중',
  completed: '완료',
  cancelled: '취소',
} as const

// 상담 유형
export const CONSULTATION_TYPES = {
  visit: '방문 상담',
  phone: '전화 상담',
  online: '온라인 상담',
} as const

// 매물 특징 옵션
export const PROPERTY_FEATURES = [
  '엘리베이터',
  '주차가능',
  '반려동물',
  '베란다/발코니',
  '풀옵션',
  '신축',
  '복층',
  '역세권',
  '학군우수',
  '공원인접',
  '남향',
  '탁트인조망',
] as const

// 시/도 목록
export const CITIES = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
] as const

// 서울 구 목록 (예시)
export const SEOUL_DISTRICTS = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
] as const
