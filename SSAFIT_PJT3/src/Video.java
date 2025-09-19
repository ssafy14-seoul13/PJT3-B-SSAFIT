
public class Video {
    String title;
    String part; // 운동 부위 (예: "하체", "코어")
    String difficulty; // 난이도 (예: "초급", "중급")
    String creator; // 크리에이터 이름
    double rating; // 평점 (리뷰 목록 분석용)

    public Video(String title, String part, String difficulty, String creator, double rating) {
        this.title = title;
        this.part = part;
        this.difficulty = difficulty;
        this.creator = creator;
        this.rating = rating;
    }

    // getter 메서드들
    public String getTitle() {
        return title;
    }

    public String getPart() {
        return part;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public String getCreator() {
        return creator;
    }

    public double getRating() {
        return rating;
    }
}