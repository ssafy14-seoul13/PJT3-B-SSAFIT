import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RecommendationService {
	
    /**
     * 사용자의 찜 목록, 리뷰 목록, 신체 정보를 기반으로 가중치를 적용하여 영상을 추천합니다.
     * @param likedVideos 찜 목록
     * @param reviewedVideos 리뷰 목록
     * @param userPhysicalLevel 사용자 신체 수준 (e.g., "초급", "중급")
     * @return 가중치 순으로 정렬된 추천 영상 목록
     */
    public List<Video> recommendVideos(
            List<Video> likedVideos,
            List<Video> reviewedVideos,
            String userPhysicalLevel) {

        Map<Video, Double> videoScores = new HashMap<>();

        // 1. 찜 목록 분석 (가중치: 찜한 영상은 점수 10점 부여)
        for (Video video : likedVideos) {
            videoScores.put(video, videoScores.getOrDefault(video, 0.0) + 10.0);
        }

        // 2. 리뷰 목록 분석 (가중치: 평점에 비례하여 점수 부여)
        for (Video video : reviewedVideos) {
            // 평점이 4.0 이상인 경우, 평점 * 2.0을 가중치로 추가
            if (video.rating >= 4.0) {
                videoScores.put(video, videoScores.getOrDefault(video, 0.0) + video.rating * 2.0);
            }
        }
        
        // 3. 사용자 신체 수준 반영 (가중치: 난이도가 일치하면 5점 추가)
        // 모든 영상에 대해 순회하며 난이도 일치 여부 확인
        // 예시를 위해 찜 목록과 리뷰 목록을 모두 합친 전체 영상 목록을 가정
        List<Video> allVideos = new ArrayList<>();
        allVideos.addAll(likedVideos);
        allVideos.addAll(reviewedVideos);

        for (Video video : allVideos) {
            if (video.difficulty.equals(userPhysicalLevel)) {
                 videoScores.put(video, videoScores.getOrDefault(video, 0.0) + 5.0);
            }
        }

        // 4. 점수가 0점인 영상은 추천 목록에서 제외 (최소 점수 기준 설정)
        // 5. 점수를 기준으로 내림차순 정렬
        List<Video> recommendedList = new ArrayList<>(videoScores.keySet());
        
        // Collections.sort()를 사용하여 점수를 기준으로 내림차순 정렬
        Collections.sort(recommendedList, new Comparator<Video>() {
            @Override
            public int compare(Video v1, Video v2) {
                return Double.compare(videoScores.get(v2), videoScores.get(v1));
            }
        });

        return recommendedList;
    }
}