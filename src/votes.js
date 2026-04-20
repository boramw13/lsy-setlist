import { supabase } from './supabase';

/**
 * 브라우저 세션 ID 생성 (중복 투표 방지용)
 * 같은 브라우저에서 여러 번 투표하는 걸 체크하는 용도
 */
export function getSessionId() {
  let sessionId = localStorage.getItem('lsy_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2) + '_' + Date.now();
    localStorage.setItem('lsy_session_id', sessionId);
  }
  return sessionId;
}

/**
 * 내가 이미 투표했는지 확인
 */
export async function hasVoted() {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('session_id', sessionId)
    .limit(1);
  
  if (error) {
    console.error('투표 확인 에러:', error);
    return false;
  }
  
  return data && data.length > 0;
}

/**
 * 투표 저장하기
 * @param {number[]} songIds - 선택한 곡 ID 5개
 */
export async function saveVote(songIds) {
  const sessionId = getSessionId();
  
  // 배열이고 5개인지 확인
  if (!Array.isArray(songIds) || songIds.length !== 5) {
    throw new Error('5곡을 선택해주세요');
  }
  
  const { data, error } = await supabase
    .from('votes')
    .insert([
      {
        session_id: sessionId,
        song_ids: songIds,
      }
    ])
    .select();
  
  if (error) {
    console.error('투표 저장 에러:', error);
    throw error;
  }
  
  console.log('✅ 투표 저장 성공:', data);
  return data;
}

/**
 * 전체 투표 결과를 집계해서 가져오기
 * 반환: { songId: votes, songId: votes, ... }
 */
export async function getVoteResults() {
  const { data, error } = await supabase
    .from('votes')
    .select('song_ids');
  
  if (error) {
    console.error('투표 조회 에러:', error);
    return {};
  }
  
  // 각 곡이 몇 번 뽑혔는지 세기
  const voteCounts = {};
  data.forEach(vote => {
    vote.song_ids.forEach(songId => {
      voteCounts[songId] = (voteCounts[songId] || 0) + 1;
    });
  });
  
  return voteCounts;
}