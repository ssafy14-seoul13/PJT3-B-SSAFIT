// 이 파일은 index.html에서만 사용됩니다.

document.addEventListener("DOMContentLoaded", () => {
  // --- 변수 및 데이터 초기화 ---
  // localStorage에서 videoData 로드, 없으면 data.js의 초기 데이터 사용
  let videoData =
    JSON.parse(localStorage.getItem("videoData")) || initialVideoData;
  let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

  let currentVideo = null;
  let currentReviewId = null;

  // --- 모달 초기화 ---
  const reviewModalElement = document.getElementById("reviewModal");
  const reviewModal = reviewModalElement
    ? new bootstrap.Modal(reviewModalElement)
    : null;

  // 영상 등록 모달 초기화
  const addVideoModalElement = document.getElementById("addVideoModal");
  const addVideoModal = addVideoModalElement
    ? new bootstrap.Modal(addVideoModalElement)
    : null;

  const deleteConfirmModalElement =
    document.getElementById("deleteConfirmModal");
  const deleteConfirmModal = deleteConfirmModalElement
    ? new bootstrap.Modal(deleteConfirmModalElement)
    : null;

  // --- 함수 정의 ---

  // 카드 디자인 변경 (채널명 표시) 및 썸네일 오류 처리 추가
  function renderVideos(listElementId, videoList) {
    const listElement = document.getElementById(listElementId);
    if (!listElement) return;

    listElement.innerHTML = "";
    videoList.forEach((video) => {
      const col = document.createElement("div");
      col.className = "col";
      const videoJsonString = JSON.stringify(video).replace(/"/g, "&quot;");
      col.innerHTML = `
        <div class="card video-card rounded-3" onclick='window.openReviewModal(${videoJsonString})'>
          <img src="${video.thumbnail}" class="video-thumbnail card-img-top" alt="${video.title}" onerror="this.onerror=null;this.src='https://placehold.co/480x360/e0e0e0/000000?text=No+Image';">
          <div class="card-body video-body">
            <h5 class="card-title video-title fw-bold">${video.title}</h5>
            <p class="card-text text-muted">${video.channelName} | ${video.part}</p>
          </div>
        </div>
      `;
      listElement.appendChild(col);
    });
  }

  // 리뷰 없을 때 메시지 표시
  function renderReviews(videoId, filteredReviews = null) {
    const reviewList = document.getElementById("modal-review-list");
    if (!reviewList) return;
    reviewList.innerHTML = "";
    const reviewsToDisplay = filteredReviews || reviews[videoId] || [];

    if (reviewsToDisplay.length === 0) {
      reviewList.innerHTML =
        '<li class="list-group-item text-center text-muted">등록된 리뷰가 없습니다.</li>';
      return;
    }

    reviewsToDisplay.forEach((review) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center rounded-3";
      li.style.cursor = "pointer";
      li.onclick = () => showReviewContent("review-detail", review);
      li.innerHTML = `
        <div>
          <h5 class="mb-1">${review.title}</h5>
          <small class="text-muted">작성자: ${review.author} | 조회수: ${
        review.views || 0
      } | 작성 시간: ${review.date}</small>
        </div>
      `;
      reviewList.appendChild(li);
    });
  }

  // HTML의 onclick에서 호출할 수 있도록 전역 window 객체에 함수 할당
  window.showReviewContent = (viewName, data = null) => {
    document
      .querySelectorAll("#review-content-container .page")
      .forEach((page) => {
        page.classList.add("d-none");
      });

    if (viewName === "review-list") {
      document
        .getElementById("modal-review-list-view")
        .classList.remove("d-none");
      if (data) {
        currentVideo = data;
        document.getElementById("modal-video-title").innerText = data.title;
        document.getElementById(
          "modal-video-player"
        ).src = `https://www.youtube.com/embed/${data.id}?autoplay=1`;
        renderReviews(data.id);
      }
    } else if (viewName === "review-detail") {
      document
        .getElementById("modal-review-detail-view")
        .classList.remove("d-none");
      currentReviewId = data.id;

      let reviewToUpdate = reviews[currentVideo.id]?.find(
        (review) => review.id === currentReviewId
      );
      if (reviewToUpdate) {
        if (
          !document
            .getElementById("modal-review-detail-view")
            .classList.contains("just-reloaded")
        ) {
          reviewToUpdate.views = (reviewToUpdate.views || 0) + 1;
          localStorage.setItem("reviews", JSON.stringify(reviews));
        }
        document.getElementById("modal-detail-views").innerText =
          reviewToUpdate.views;
      }

      document.getElementById("modal-detail-title").innerText = data.title;
      document.getElementById("modal-detail-author").innerText = data.author;
      document.getElementById("modal-detail-date").innerText = data.date;
      document.getElementById("modal-detail-content").innerText = data.content;

      document
        .getElementById("modal-review-detail-view")
        .classList.remove("just-reloaded");
    } else if (viewName === "write-review") {
      document
        .getElementById("modal-write-review-view")
        .classList.remove("d-none");
    }
  };

  window.startWriteReview = () => {
    currentReviewId = null;
    document.getElementById("modal-review-form").reset();
    document.getElementById("modal-form-title").innerText = "리뷰 작성";
    showReviewContent("write-review");
  };

  window.startEditReview = () => {
    const reviewToEdit = reviews[currentVideo.id]?.find(
      (review) => review.id === currentReviewId
    );
    if (reviewToEdit) {
      document.getElementById("modal-form-title").innerText = "리뷰 수정";
      document.getElementById("modalReviewTitle").value = reviewToEdit.title;
      document.getElementById("modalReviewContent").value =
        reviewToEdit.content;
      showReviewContent("write-review");
    }
  };

  window.openReviewModal = (video) => {
    currentVideo = video;
    const searchInput = document.getElementById("modal-review-search-input");
    if (searchInput) searchInput.value = "";
    showReviewContent("review-list", video);
    if (reviewModal) reviewModal.show();
  };

  function deleteReview() {
    if (!currentVideo || !currentReviewId) return;
    reviews[currentVideo.id] = reviews[currentVideo.id].filter(
      (review) => review.id !== currentReviewId
    );
    localStorage.setItem("reviews", JSON.stringify(reviews));
    showReviewContent("review-list", currentVideo);
    if (deleteConfirmModal) deleteConfirmModal.hide();
  }

  window.cancelReviewForm = () => {
    if (currentReviewId) {
      const reviewToView = reviews[currentVideo.id]?.find(
        (review) => review.id === currentReviewId
      );
      if (reviewToView) {
        document
          .getElementById("modal-review-detail-view")
          .classList.add("just-reloaded");
        showReviewContent("review-detail", reviewToView);
      }
    } else {
      showReviewContent("review-list", currentVideo);
    }
  };

  // --- 이벤트 리스너 설정 ---
  // ✅ '새 영상 등록' 버튼 클릭 이벤트 (새로 추가)
  document.getElementById("add-video-btn").addEventListener("click", () => {
    if (localStorage.getItem("loggedInUser")) {
      // 로그인 상태이면 모달을 직접 열어줍니다.
      addVideoModal.show();
    } else {
      // 비로그인 상태이면 알림 메시지를 띄웁니다.
      showAlert("로그인 후 이용해주세요.");
    }
  });

  // 메인 페이지 영상 검색
  const searchVideos = () => {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase();
    const filteredVideos = videoData.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm) ||
        video.part.toLowerCase().includes(searchTerm)
    );
    renderVideos("category-video-list", filteredVideos);
  };
  document
    .getElementById("search-button")
    .addEventListener("click", searchVideos);
  document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchVideos();
  });

  // 카테고리 필터링
  document.querySelectorAll(".btn-category").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-category")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const category = button.dataset.category;
      const filteredVideos =
        category === "all"
          ? videoData
          : videoData.filter((v) => v.category === category);
      renderVideos("category-video-list", filteredVideos);
    });
  });

  // 리뷰 모달 내 검색 기능
  const searchReviews = () => {
    const reviewSearchInput = document.getElementById(
      "modal-review-search-input"
    );
    const searchTerm = reviewSearchInput.value.toLowerCase();
    if (currentVideo) {
      const videoId = currentVideo.id;
      const allReviews = reviews[videoId] || [];
      const filtered = allReviews.filter(
        (review) =>
          review.title.toLowerCase().includes(searchTerm) ||
          review.content.toLowerCase().includes(searchTerm) ||
          review.author.toLowerCase().includes(searchTerm)
      );
      renderReviews(videoId, filtered);
    }
  };

  const reviewSearchInput = document.getElementById(
    "modal-review-search-input"
  );
  document
    .getElementById("modal-review-search-button")
    .addEventListener("click", () => {
      searchReviews();
      reviewSearchInput.value = "";
    });
  reviewSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchReviews();
      reviewSearchInput.value = "";
    }
  });

  // 영상 등록 폼 제출 이벤트 리스너
  document.getElementById("add-video-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const videoUrl = document.getElementById("videoUrl").value;
    const videoTitle = document.getElementById("videoTitle").value;
    const videoChannel = document.getElementById("videoChannel").value;
    const videoPart = document.getElementById("videoPart").value;

    const urlRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoUrl.match(urlRegex);

    if (!match) {
      showAlert("유효하지 않은 유튜브 링크입니다.");
      return;
    }

    const videoId = match[1];
    const newVideo = {
      id: videoId,
      title: videoTitle,
      part: videoPart,
      category:
        videoPart === "전신"
          ? "all"
          : videoPart === "상체"
          ? "upper"
          : videoPart === "하체"
          ? "lower"
          : "abs",
      channelName: videoChannel,
      url: `https://www.youtube.com/embed/${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      views: 0,
    };

    videoData.push(newVideo);
    localStorage.setItem("videoData", JSON.stringify(videoData));

    // 목록 다시 그리기
    renderVideos("category-video-list", videoData);
    renderVideos(
      "most-viewed-list",
      [...videoData].sort((a, b) => b.views - a.views).slice(0, 3)
    );

    addVideoModal.hide();
    showAlert("영상이 성공적으로 등록되었습니다!");
    e.target.reset();
  });

  // 리뷰 폼 제출
  document
    .getElementById("modal-review-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("modalReviewTitle").value;
      const content = document.getElementById("modalReviewContent").value;
      const author = localStorage.getItem("loggedInUser") || "익명";
      const videoId = currentVideo.id;

      if (currentReviewId) {
        const reviewToUpdate = reviews[videoId]?.find(
          (review) => review.id === currentReviewId
        );
        if (reviewToUpdate) {
          reviewToUpdate.title = title;
          reviewToUpdate.content = content;
          reviewToUpdate.date = new Date().toLocaleString();
        }
      } else {
        const newReview = {
          id: Date.now(),
          title,
          content,
          author,
          date: new Date().toLocaleString(),
          views: 0,
        };
        if (!reviews[videoId]) reviews[videoId] = [];
        reviews[videoId].push(newReview);
      }
      localStorage.setItem("reviews", JSON.stringify(reviews));
      showReviewContent("review-list", currentVideo);
    });

  // 리뷰 삭제 확인
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", deleteReview);

  // --- 초기 렌더링 ---
  function initialRender() {
    const mostViewedVideos = [...videoData]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
    renderVideos("most-viewed-list", mostViewedVideos);
    renderVideos("category-video-list", videoData);
  }

  initialRender();
});
