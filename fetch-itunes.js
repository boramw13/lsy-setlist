// 이승윤 Artist ID로 앨범 데이터 가져오기 (최종 버전)
// 실행: node fetch-spotify.js

import { writeFileSync } from 'fs';

const ARTIST_ID = 484023160; // 싱어게인 이승윤
const COUNTRY = 'KR';

// 아티스트 ID로 그 사람의 모든 앨범 가져오기
async function fetchArtistAlbums() {
  console.log(`🔍 이승윤 (ID: ${ARTIST_ID}) 앨범 가져오는 중...\n`);
  
  // lookup API에 entity=album으로 요청 = 그 아티스트의 앨범 목록
  const url = `https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=album&country=${COUNTRY}&limit=200`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // 첫 번째는 아티스트 정보, 나머지가 앨범
  const albums = data.results.filter(item => item.wrapperType === 'collection');
  
  console.log(`✨ 총 ${albums.length}개 앨범 발견!\n`);
  
  return albums;
}

// 메인 실행
async function main() {
  try {
    console.log('🎵 이승윤 iTunes 데이터 수집 시작\n');
    
    const albums = await fetchArtistAlbums();
    
    if (albums.length === 0) {
      console.log('❌ 앨범을 찾을 수 없어요');
      return;
    }
    
    // 최신순으로 정렬 (발매일 내림차순)
    albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    
    console.log('📋 앨범 목록 (최신순):\n');
    
    const albumData = [];
    
    for (let i = 0; i < albums.length; i++) {
      const album = albums[i];
      console.log(`${i + 1}. ${album.collectionName}`);
      console.log(`   발매일: ${album.releaseDate?.substring(0, 10)}`);
      console.log(`   트랙 수: ${album.trackCount}`);
      console.log(`   타입: ${album.collectionType}`);
      console.log('');
      
      albumData.push({
        id: album.collectionId,
        name: album.collectionName,
        artist: album.artistName,
        releaseDate: album.releaseDate?.substring(0, 10),
        trackCount: album.trackCount,
        // 100x100을 600x600으로 업그레이드
        coverUrl: album.artworkUrl100?.replace('100x100', '600x600'),
        coverUrlSmall: album.artworkUrl100,
        itunesUrl: album.collectionViewUrl,
      });
    }
    
    // JSON 파일로 저장
    writeFileSync('./albums.json', JSON.stringify(albumData, null, 2), 'utf-8');
    
    console.log('\n✅ albums.json 파일로 저장 완료!');
    console.log(`📊 총 ${albumData.length}개 앨범 저장됨`);
    console.log('📁 생성된 파일: albums.json\n');
    
  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    console.error(error);
  }
}

main();