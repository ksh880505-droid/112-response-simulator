window.TRAINING_SCENARIOS = [
  {
    id: "knife-threat-mental-health",
    title: "정신질환 의심 흉기 소지자",
    steps: [
      {
        situation: "칼을 든 남성이 경찰을 발견하자 고성을 지르며 빠르게 접근하기 시작합니다. 현재 대상자와의 거리는 약 12m이며, 뒤쪽에는 순찰차가 있습니다.",
        facts: [["거리", "약 12m"], ["대상자", "빠르게 접근"], ["주변", "보행자 2명"]],
        principle: "반응 시간을 만들고, 위험선에서 벗어날 방법을 먼저 찾으십시오.",
        choices: [
          { label: "후퇴하며 거리 확보", tone: "recommended", scores: { safety: 28, tactical: 25, legal: 20 }, result: "대상자와의 간격이 늘어나 판단과 대응을 위한 시간이 확보됩니다.", coaching: "이동 방향의 장애물과 제3자를 함께 확인하며 통제된 후퇴를 이어가십시오." },
          { label: "순찰차를 엄폐물로 활용", tone: "recommended", scores: { safety: 30, tactical: 28, legal: 20 }, result: "대상자와 직접 마주한 선에서 벗어나 물리적 차단물을 확보했습니다.", coaching: "엄폐는 거리 확보와 함께 사용할 때 효과적입니다. 시야와 퇴로를 계속 확인하십시오." },
          { label: "현 위치를 유지하며 구두 경고", scores: { safety: 8, tactical: 12, legal: 18 }, result: "경고는 전달됐지만 대상자는 계속 접근하며 대응 시간이 줄어듭니다.", coaching: "의사소통만으로 안전 공간이 생기지는 않습니다. 거리와 엄폐를 동시에 확보해야 합니다." },
          { label: "대상자에게 접근해 제압 시도", tone: "danger", scores: { safety: 0, tactical: 2, legal: 5 }, result: "흉기의 유효 범위에 들어가 경찰관과 주변인의 위험이 급격히 커집니다.", coaching: "즉각적인 접근은 선택 가능한 대응 수단과 시간을 줄입니다. 먼저 이격하십시오." }
        ]
      },
      {
        situation: "대상자는 잠시 멈췄지만 흉기를 내려놓지 않았습니다. 큰 소리로 횡설수설하고 있으며 주변 상점에서 사람들이 상황을 지켜보고 있습니다.",
        facts: [["행동", "일시 정지"], ["흉기", "계속 소지"], ["지원", "미도착"]],
        principle: "상황이 잠시 정체된 시간을 지원과 현장 통제를 강화하는 데 사용하십시오.",
        choices: [
          { label: "지원 요청 및 주변인 대피", tone: "recommended", scores: { safety: 26, tactical: 28, legal: 22 }, result: "추가 인력과 역할 분담을 요청하고 제3자의 위험 노출을 줄였습니다.", coaching: "위치, 대상자 상태, 흉기, 진행 방향을 짧고 정확하게 공유하십시오." },
          { label: "침착하게 경고와 지시 반복", scores: { safety: 17, tactical: 20, legal: 24 }, result: "명확한 지시로 대상자의 반응을 확인할 수 있지만 지원과 주변 통제가 지연됩니다.", coaching: "짧고 구체적인 지시는 유용합니다. 다만 거리·엄폐·지원 요청과 병행하십시오." },
          { label: "가용 물리력 수단을 준비", scores: { safety: 20, tactical: 22, legal: 17 }, result: "상황 악화에 대비했지만 주변인 통제와 지원 요청이 충분하지 않습니다.", coaching: "장비 준비는 자동적인 사용 결정을 의미하지 않습니다. 위해 수준을 계속 재평가하십시오." }
        ]
      },
      {
        situation: "대상자가 다시 흉기를 들어 올리고 경찰 방향으로 움직입니다. 지원 인력은 접근 중이며, 대상자 뒤쪽은 벽으로 막혀 있습니다.",
        facts: [["위협", "흉기 들어 올림"], ["거리", "약 8m"], ["지원", "접근 중"]],
        principle: "수단의 명칭보다 현재 위협, 거리, 실패 가능성, 주변 위험을 함께 판단하십시오.",
        choices: [
          { label: "엄폐를 유지하며 계속 이격", tone: "recommended", scores: { safety: 25, tactical: 23, legal: 24 }, result: "위험 노출을 줄이며 지원 도착까지 추가 판단 시간을 확보합니다.", coaching: "후퇴 경로가 안전하고 제3자에게 위험을 전가하지 않는지 계속 확인하십시오." },
          { label: "테이저건 사용 가능성 검토", scores: { safety: 21, tactical: 22, legal: 20 }, result: "비살상 장비의 조건과 실패 가능성을 검토하며 대체 계획을 준비합니다.", coaching: "거리와 환경, 대상자의 복장, 실패 시 즉시 전환할 대응을 함께 고려해야 합니다." },
          { label: "경찰봉을 들고 접근", tone: "danger", scores: { safety: 3, tactical: 5, legal: 8 }, result: "흉기 소지자와의 거리를 스스로 좁혀 중대한 부상 위험이 커집니다.", coaching: "접촉 거리의 장비는 흉기 위협에서 경찰관의 안전 여유를 크게 줄일 수 있습니다." },
          { label: "권총 사용을 즉시 결정", scores: { safety: 14, tactical: 10, legal: 3 }, result: "구체적 위해 수준과 다른 수단을 충분히 재평가하지 않은 채 결론을 앞당겼습니다.", coaching: "무기 사용은 법정 요건과 필요성·상당성을 개별 상황에서 엄격히 판단해야 합니다." }
        ]
      }
    ]
  }
];
