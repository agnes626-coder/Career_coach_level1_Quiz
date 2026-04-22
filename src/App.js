import React, { useEffect, useMemo, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBukV3jDZFyJoplHOXLUfpn4UTaKUGaV_E",
  authDomain: "coaching-quiz-2026.firebaseapp.com",
  projectId: "coaching-quiz-2026",
  storageBucket: "coaching-quiz-2026.firebasestorage.app",
  messagingSenderId: "874203183794",
  appId: "1:874203183794:web:2007bf44055f9c950ae7ab",
  measurementId: "G-BE2FGBR43C",
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const firebaseApp = hasFirebaseConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;
const db = firebaseApp ? getFirestore(firebaseApp) : null;

//필기 퀴즈 문항//

const quizData = [
  {
    id: 1,
    originalId: 1,
    module: "모듈 1",
    difficulty: "하",
    question: "'커리어(career)'의 어원에 대한 설명으로 가장 올바른 것은?",
    options: [
      "라틴어 카루스 (caruss)에서 유래하여 '수레가 길을 따라 굴러간다'는 뜻이다.",
      "그리스어에서 유래하여 '치열한 경쟁'을 의미한다.",
      "한자로 '직업'을 뜻하며 돈을 버는 수단을 의미한다.",
      "영어 단어로 '정지된 상태'를 의미한다.",
    ],
    answer: 0,
    explanation:
      "커리어는 라틴어 카루스(caruss, 마차/수레)에서 유래 한 말로, 수레가 길을 따라 굴러간다는 의미를 가집니다.",
  },
  {
    id: 2,
    originalId: 2,
    module: "모듈 1",
    difficulty: "중",
    question:
      "커리어 패러다임의 변화 중 '신 패러다임'에 해당하는 특징으로 짝지어진 것은?",
    options: [
      "직업 안정성과 수직적 경력 경로",
      "단일 커리어와 직위/타이틀 중시",
      "고용가능 안정성과 일과 가족의 균형",
      "학위 중심과 경력의 안정성",
    ],
    answer: 2,
    explanation:
      "신 패러다임은 직업 안정성보다는 고용가능 안정성을, 수직적 성공보다는 일과 가족의 균형 및 대안적 경력 경로를 중 시합니다.",
  },
  {
    id: 3,
    originalId: 2,
    module: "모듈 1",
    difficulty: "중",
    question: "커리어코칭에서 ABC프로세스에서 맞지 않는 것은?",
    options: ["진단", "실행", "발견", "설계"],
    answer: 3,
    explanation:
      "A(Assesment)커리어 진단, B(Building)커리어 쌓기, C(Change)커리어 변화",
  },
  {
    id: 4,
    originalId: 3,
    module: "모듈 1",
    difficulty: "상",
    question: "구 패러다임과 신 패러다임을 비교한 것으로 올바르지 않은 것은?",
    options: [
      "구 패러다 임은 수직적 경력 경로를 따르나, 신 패러다임은 대안적 경력 경로를 따른다.",
      "구 패러다임의 성공 기준은 경력성공이나, 신 패러다임은 일과 가 족의 균형이다.",
      "구 패러다임은 계속적 학습을 강조하나, 신 패러다임은 학위 취득을 강조한다.",
      "구 패러다임은 단일 커리어를, 신 패러다임은 복수 커리어를 지향한다.",
    ],
    answer: 2,
    explanation:
      "학위 취득을 강조하는 것은 구 패러다임이며, 계속적 학습과 능력 개발을 강조하는 것이 신 패러다임입니다.",
  },
  {
    id: 5,
    originalId: 4,
    module: "모듈 1",
    difficulty: "하",
    question:
      "성취스토리를 구조화하여 작성할 때 사용하는 'STAR 기법'의 구성 요소가 아닌 것은?",
    options: [
      "Situation (상황)",
      "Target (목표)",
      "Action (행동)",
      "Reward (보상)",
    ],
    answer: 3,
    explanation:
      "STAR 기법의 R은 Reward(보상)가 아니라 Result(결과)를 의미합니다.",
  },
  {
    id: 6,
    originalId: 5,
    module: "모듈 1",
    difficulty: "중",
    question:
      "STAR 기법을 활용한 성취스토리 사례에서 '부스 비용을 25% 낮추고 유치 수를 늘리는 것 으로 방향을 잡았습니다.'는 어느 단계에 해당하는가?",
    options: [
      "Situation (상황)",
      "Target (목표)",
      "Action (행동)",
      "Result (결과)",
    ],
    answer: 1,
    explanation:
      "구체적인 지향점과 방향을 설정하는 것은 Target(목표) 단계에 해당합니다.",
  },
  {
    id: 7,
    originalId: 6,
    module: "모듈 1",
    difficulty: "중",
    question:
      "STAR 기법을 활용한 성취스토리 사례에서 '관련 학과를 직접 방문하여 학생의 참여와 관 람을 부탁드렸습니다.'는 어느 단계에 해당하는가?",
    options: [
      "Situation (상황)",
      "Target (목표)",
      "Action (행동)",
      "Result (결과)",
    ],
    answer: 2,
    explanation:
      "목표를 달성하기 위해 실제로 취한 구체적인 노력과 행동이므로 Action(행동) 단계입니다.",
  },
  {
    id: 8,
    originalId: 7,
    module: "모듈 1",
    difficulty: "하",
    question: "커리어의 개념에 대한 설명으로 올바르지 않은 것은?",
    options: [
      "한 개인의 생애 과정에 서 거쳐 가는 모든 체험을 의미한다.",
      "일에 대한 태도와 지식, 직업의 만족도도 포함된다.",
      "특정 직장에서의 단기적인 직무만을 의미한다.",
      "진 로계획과 직업 탐색이 모두 포함된 포괄적 개념이다.",
    ],
    answer: 2,
    explanation:
      "커리어는 특정 직장이나 단기적인 직무를 넘어, 일과 관련해 생 애 전반에 걸쳐 경험하는 모든 체험을 포함합니다.",
  },
  {
    id: 9,
    originalId: 8,
    module: "모듈 1",
    difficulty: "상",
    question:
      "'보이지 않는 것이 보이는 것을 지배한다'는 원리와 관련하여, 코칭에서 다루어야 할 내면 적 요소에 해당하지 않는 것은?",
    options: [
      "현재의 나의 진짜 모습",
      "인생의 궁극적인 사명(Mission)",
      "타인에게 보여주기 위한 가짜 스펙",
      "달 성하고자 하는 핵심 목표(Target)",
    ],
    answer: 2,
    explanation:
      "보이지 않는 내면의 사명, 목표, 현재 상태에 대한 성찰이 겉으로 보이는 성과를 지 배한다는 의미이며, 허위 스펙은 이에 해당하지 않습니다.",
  },
  {
    id: 10,
    originalId: 9,
    module: "모듈 1",
    difficulty: "상",
    question: "훌륭한 코치의 역할에 대한 교안의 설명으로 가장 적절한 것은?",
    options: [
      "선수들의 과 거 잘못을 정확히 찾아내어 분석하는 사람",
      "선수들이 현재 누구인가를 넘어서 '무엇이 될 수 있는지'를 알게 해주는 사람",
      "선수들에게 일방적 으로 정답을 주입하고 훈련시키는 사람",
      "선수들의 약점만을 집요하게 보완하여 평균을 맞추는 사람",
    ],
    answer: 1,
    explanation:
      "훌륭한 코치는 대상자의 미래 가능성을 일깨워주어, 그들이 스스로 무엇이 될 수 있는지를 깨닫게 돕는 사람입니다.",
  },
  {
    id: 11,
    originalId: 10,
    module: "모듈 1",
    difficulty: "하",
    question:
      "Career Focusing을 위해 자신을 명확히 정의하는 문장의 빈칸에 들어갈 말은? '나의 [ ] 은/는 ~이다.'",
    options: ["약점", "강점", "콤플렉스", "스펙"],
    answer: 1,
    explanation:
      "커리어 포커싱의 핵심은 자신의 '강점'을 명확히 정의하고 그것을 기반으로 커리어를 개발하는 것입니다.",
  },
  {
    id: 12,
    originalId: 11,
    module: "모듈 1",
    difficulty: "중",
    question:
      "신 패러다임 하에서 개인의 커리어 개발에 가장 중요한 요소는 무엇인가?",
    options: [
      "한 직장에서 정년까지 버티는 직업 안정성",
      "무조건적인 높은 직위와 타이틀 획득",
      "급변하는 환경에 적응하기 위한 고용가능 안정성과 계속적 학 습",
      "타인과의 치열한 경쟁을 통한 단일 커리어 구축",
    ],
    answer: 2,
    explanation:
      "신 패러다임은 평생직장의 개념이 사라지고, 계속적 학습을 통해 언제든 일할 수 있는 고용가능성(Employability)을 중시합니다.",
  },
  {
    id: 13,
    originalId: 12,
    module: "모듈 1",
    difficulty: "하",
    question:
      "성취스토리 쓰기의 결과(Result) 단계에 포함되어야 할 내용으로 가장 알맞은 것은?",
    options: [
      "사건이 발생한 배경 설명",
      "앞으로 달성하고 싶은 구체적인 목표 수치",
      "행동을 통해 얻어낸 구체적인 성과나 변화",
      "문제를 해결하 기 위해 시도했던 여러 가지 방법들",
    ],
    answer: 2,
    explanation:
      "Result(결과) 단계는 Action(행동)을 통해 최종적으로 어떤 긍정적 성과를 달성했 는지 명확하게 기술하는 부분입니다.",
  },
  {
    id: 14,
    originalId: 13,
    module: "모듈 2",
    difficulty: "중",
    question:
      "코칭대화 모델인 R-GROWS의 구성 요소와 의미가 바르게 짝지어지지 않은 것은?",
    options: [
      "Rapport - 신뢰관계 형성",
      "Goal - 원하는 상태 및 목표 설정",
      "Options - 현재 상태 파악",
      "Support - 실행 격려·실행의지 다짐",
    ],
    answer: 2,
    explanation:
      "Options는 대안 탐색이며, 현재 상태를 파악하는 단계는 Reality입니다.",
  },
  {
    id: 15,
    originalId: 14,
    module: "모듈 2",
    difficulty: "하",
    question:
      "R-GROWS 모델 중 코칭 전 과정에 걸쳐 지속적으로 유지되어야 하는 단계는 무엇인 가?",
    options: [
      "Goal (목표 설정)",
      "Reality (현실 파악)",
      "Rapport (라포 형성)",
      "Support (성공 지원)",
    ],
    answer: 2,
    explanation:
      "상대방의 세계에 들어가 깊은 유대감을 형성하는 '라포(Rapport)'는 단일 단계로 끝나는 것이 아니라 코칭 내내 굳건히 유지되어야 합니다.",
  },
  {
    id: 16,
    originalId: 15,
    module: "모듈 2",
    difficulty: "하",
    question:
      "'오늘 코칭이 끝났을 때 어떻게 되기를 원하세요?'라는 질문은 R-GROWS 모델의 어느 단 계에 해당하는가?",
    options: ["Rapport", "Goal", "Reality", "Options"],
    answer: 1,
    explanation:
      "대상자가 원하는 바를 명확히 하고 대화의 방향을 설정하는 Goal(목표 설정) 단계의 핵심 질문입니다.",
  },
  {
    id: 17,
    originalId: 16,
    module: "모듈 2",
    difficulty: "중",
    question:
      "'목표가 달성된 상태를 10점으로 본다면, 현재는 몇 점인가요?'라는 질문은 R-GROWS 모 델의 어느 단계인가?",
    options: ["Goal", "Reality", "Options", "Will"],
    answer: 1,
    explanation:
      "현재의 객관적 상황과 위치를 점검하는 Reality(현실 파악) 단계의 대표적인 척도 질문입니다.",
  },
  {
    id: 18,
    originalId: 17,
    module: "모듈 2",
    difficulty: "상",
    question:
      "Options(대안 탐색) 단계에서 코치가 고객의 사고를 확장하기 위해 사용할 수 있는 가장 적절한 질문은?",
    options: [
      "이 목표는 당신에게 어떤 의미가 있나요?",
      "목표 달성을 위해 지금까지 시도했던 일은 무엇인가요?",
      "그 분야의 최 고 전문가가 조언한다면 어떤 조언을 할까요?",
      "실행에 방해가 되는 것은 무엇인가요?",
    ],
    answer: 2,
    explanation:
      "대안 탐색 단계에서는 시야를 넓히기 위해 '전문가라면?', '절대자가 있다면?'과 같은 관점 전환 질문을 적극 활용합니다.",
  },
  {
    id: 19,
    originalId: 18,
    module: "모듈 2",
    difficulty: "중",
    question:
      "'실행은 언제, 어디서, 언제까지, 어떻게 하실 건가요?'라는 구체적인 질문이 사용되는 단 계는?",
    options: ["Reality", "Options", "Will", "Support"],
    answer: 2,
    explanation:
      "여러 대안 중 하나를 선택해 행동을 위한 구체적인 육하원칙 계획을 수립하는 Will(실행계획 수립) 단계의 질문입니다.",
  },
  {
    id: 20,
    originalId: 19,
    module: "모듈 2",
    difficulty: "상",
    question:
      "Support(성공 지원) 단계에서 코치가 집중해야 할 질문 초점으로 가장 올바른 것은?",
    options: [
      "친밀감과 신뢰관계 형성",
      "현재 직면한 문제의 원인 분석",
      "가능한 대안과 전략의 나열",
      "실행 격려 및 실행 의지 다짐",
    ],
    answer: 3,
    explanation:
      "코칭의 마무리인 Support 단계에서는 고객의 실행을 지지하고, 필요한 후원 환경을 점검하며 실행 의지를 단단히 다지도록 돕습니 다.",
  },
  {
    id: 21,
    originalId: 20,
    module: "모듈 2",
    difficulty: "하",
    question:
      "대상자의 실행력을 강화하기 위해 '지금 하고 계신 일의 상태를 10점 만점이라 한다면 몇 점 정도인가요?'라고 묻는 질문 기법은?",
    options: ["기적 질문", "척도 질문", "예외 질문", "대처 질문"],
    answer: 1,
    explanation:
      "수치를 활용 하여 현재 상태를 객관화하고 다음 단계로의 목표를 구체화하게 하는 척도 질문입니다.",
  },
  {
    id: 22,
    originalId: 21,
    module: "모듈 2",
    difficulty: "중",
    question: "토니 로빈스가 정의한 '라포(Rapport)'의 진정한 의미는 무엇인가?",
    options: [
      "상대방의 약점을 정확히 지적하여 복종하게 만드는 능력",
      "전문적인 용어를 사용하여 코치의 권위를 내세우는 능력",
      "상대방의 세계에 들어가 그를 이해 하고 강력한 유대감을 갖고 있다고 느끼게 만드는 능력",
      "대화의 주도권을 쥐고 상대방의 말을 능숙하게 끊는 능력",
    ],
    answer: 2,
    explanation:
      "라포는 단순한 아이스브레이킹을 넘어, 상대방의 세계관을 이해하고 깊은 정서적 연결을 형성하는 것을 뜻합니다.",
  },
  {
    id: 23,
    originalId: 22,
    module: "모듈 2",
    difficulty: "상",
    question:
      "'만약 당신이 성공한다면, 성공한 자신에게 어떤 말을 해주고 싶은가요?'라는 질문의 주 요 목적은 무엇인가?",
    options: [
      "과거의 실패 원인 분석",
      "현실의 장벽에 대한 좌절감 유도",
      "스스로에 대한 격려와 실행 의지(Support) 강화",
      "코치에 대한 전적인 의존도 향상",
    ],
    answer: 2,
    explanation:
      "성공을 미리 시각화하고 스스로를 격려하게 함으로써 실행 동기를 극대화하는 Support 단계의 강력한 질문입니다.",
  },
  {
    id: 24,
    originalId: 23,
    module: "모듈 2",
    difficulty: "중",
    question:
      "'목표달성을 위해 지금까지 시도했던 일은 무엇인가요?'라는 질문을 통해 파악하고자 하 는 것은?",
    options: [
      "미래의 새로운 창의적 대안",
      "대상자가 현재까지 가진 자원과 현실적인 노력(Reality)",
      "완전히 불가능한 대안 상상하기",
      "다음 코칭 세션의 일정 조율",
    ],
    answer: 1,
    explanation:
      "Reality 단계에서 현재의 위치와 지금까지의 자원을 점검하여, 앞으로 무엇을 더 해야 할 지 파악하기 위함입니다.",
  },
  {
    id: 25,
    originalId: 24,
    module: "모듈 2",
    difficulty: "상",
    question:
      "코치가 질문을 통해 상대의 내면을 깊이 파악하고자 할 때 주의 깊게 들어야 할 '세 가 지 V'에 속하지 않는 것은?",
    options: [
      "Vision (비전)",
      "Value (가치관)",
      "Vocabulary (어휘)",
      "Violence (폭력성)",
    ],
    answer: 3,
    explanation:
      "상대 의 시선이 머무는 비전, 중요하게 여기는 가치관, 그리고 무의식적으로 자주 쓰는 어휘(Vocabulary)에 집중해야 합니다.",
  },
  {
    id: 26,
    originalId: 119,
    module: "모듈 2",
    difficulty: "하",
    question: "좋은 질문은 만드는 방법과 거리가 먼 것은?",
    options: [
      "대상자의 목표",
      "대상자의 가치관",
      "대상자가 자주 사용하는 단어",
      "코치의 판단",
    ],
    answer: 3,
    explanation:
      "좋은 질문을 만들기 위해서는 대상자의 목표와 가치관을 고려하고 대상자가 자주 사용하는 단어를 같이 사용하는 것이 좋습니다.",
  },
  {
    id: 27,
    originalId: 110,
    module: "모듈 2",
    difficulty: "하",
    question:
      "다른 모든 일을 쉽게 하거나 불필요하게 만드는 단 한 가지의 중요한 일”을 묻는 질문을 어떤 질 문이라 하는가?",
    options: [
      "Meta question",
      "Detail question",
      "One thing question",
      "Target question",
    ],
    answer: 2,
    explanation:
      "한 가지에 집중 하게 하면 단순함의 힘으로 인해 대상자의 생산성을 극대화 할 수 있습니다.",
  },
  {
    id: 28,
    originalId: 111,
    module: "모듈 2",
    difficulty: "하",
    question: "다음 중 효과적인 질문을 위한 코치의 촉진행동과 거리가 먼 것은?",
    options: [
      "대상자가 지금, 여기 머물게 한다.",
      "질문을 위한 질문을 한다.",
      "대상자가 답을 갖고 있다는 것을 안다.",
      "대상자의 자아 발견을 위한 질문을 한다.",
    ],
    answer: 1,
    explanation:
      "코치는 대상자가 답을 갖고 있다는 것을 알고 지금 여기에 머물며 자아발견을 할 수 있도록 촉진해야 합니다..",
  },
  {
    id: 29,
    originalId: 112,
    module: "모듈 2",
    difficulty: "하",
    question: "다음 중 질문을 통한 대상자의 긍정적 변화와 거리가 먼 것은?",
    options: [
      "기존 사고와 행동 패 턴이 바뀐다.",
      "창조적으로 사고한다.",
      "감정적으로 반응하게 된다.",
      "자신의 현실을 객관적으로 인식한다.",
    ],
    answer: 2,
    explanation:
      "열린 질문을 통해 대 상자는 창조적으로 사고할 수 있고 자신의 현실을 객관적으로 인식할 수 있으며, 기존 사고와 행동 패턴이 바뀔 수 있다.",
  },
  {
    id: 30,
    originalId: 111,
    module: "모듈 2",
    difficulty: "하",
    question: "다음 중 효과적인 질문을 위한 코치의 촉진행동과 거리가 먼 것은?",
    options: [
      "대상자가 지금, 여 기 머물게 한다.",
      "질문을 위한 질문을 한다.",
      "대상자가 답을 갖고 있다는 것을 안다.",
      "대상자의 자아 발견을 위한 질문을 한다.",
    ],
    answer: 1,
    explanation:
      "코치는 대상자가 답을 갖고 있다는 것을 알고 지금 여기에 머물며 자아발견을 할 수 있도록 촉진해야 합니다..",
  },
  {
    id: 31,
    originalId: 25,
    module: "모듈 3",
    difficulty: "중",
    question: "NLP(Neuro Linguistic Programming)의 개념을 가장 잘 설명한 것은?",
    options: [
      "인간의 무의식을 분석하여 과거의 트라우마를 치료하는 의학 기법",
      "신경과 언어, 신체 사이의 상호작용에 의해 만들어진 패턴을 연구한 코칭 이론",
      "오로지 이성적 사고만을 활용하여 논리력을 키우는 교육 프로그램",
      "기계를 제어하기 위해 언어를 입력하는 컴퓨터 프로그래밍 기술",
    ],
    answer: 1,
    explanation:
      "NLP는 신경(Neuro), 언어(Linguistic), 신체적 행동 패턴(Programming) 간의 유기적 상호작용을 다루는 심리 및 코칭 이론입니다.",
  },
  {
    id: 32,
    originalId: 26,
    module: "모듈 3",
    difficulty: "상",
    question:
      "NLP의 전제 No. 27에 명시된 인간 행동에 대한 관점으로 올바른 것은?",
    options: [
      "인간 의 행동은 예측할 수 없는 무작위의 결과이다.",
      "타인에게 해를 끼치는 행동은 오직 악한 의도에서만 비롯된다.",
      "모든 인간의 행동에는 긍정적 인 의도가 있다.",
      "인간은 외부 환경에 의해서만 수동적으로 조종당한다.",
    ],
    answer: 2,
    explanation:
      "겉보기에 부정적이거나 이해되지 않는 행동 일지라도, 그 내면에는 자신을 보호하거나 무엇인가를 얻으려는 긍정적 의도가 숨어 있다고 전제합니다.",
  },
  {
    id: 33,
    originalId: 27,
    module: "모듈 3",
    difficulty: "하",
    question:
      "변화의 문을 여는 열쇠로서, '내가 지금 무엇을 느끼고, 어떤 생각을 하며, 어떤 신체 반 응이 있는지'를 자각하는 능력을 무엇이라 하는가?",
    options: ["알아차림", "억압", "회피", "합리화"],
    answer: 0,
    explanation:
      "알아차림(Awareness) 은 현재 자신의 감정과 신념, 상태를 있는 그대로 인식하는 것으로 코칭의 출발점이 됩니다.",
  },
  {
    id: 34,
    originalId: 28,
    module: "모듈 3",
    difficulty: "하",
    question:
      "코칭 실습 중 '신념의 문장'을 작성할 때 가장 적절한 문장의 형태는?",
    options: [
      "어쩌면 ~일지도 모른다",
      "반드시 ~해야 한다 / 마땅히 ~해야 한다",
      "나는 ~할 수 없다",
      "남들이 ~라고 하더라",
    ],
    answer: 1,
    explanation:
      "신념은 개인 의 사고와 행동을 지배하는 강력한 내면의 규칙이므로, 주로 '반드시 ~해야 한다'는 당위적 형태로 강하게 표현됩니다.",
  },
  {
    id: 35,
    originalId: 29,
    module: "모듈 3",
    difficulty: "중",
    question: "코치의 성찰을 위한 질문 중 올바른 태도를 나타내는 것은?",
    options: [
      "나는 고객의 '마 음(context)'보다 겉으로 드러난 '말(text)'에만 집중하고 있는가?",
      "고객이 불편한 감정을 표현하면 즉시 대화 주제를 바꾸는가?",
      "나는 고객의 말 이면에서 무엇이 진짜 중요한지 알아차리고 있는가?",
      "고객의 신념은 무시하고 코치의 신념을 우선시하는가?",
    ],
    answer: 2,
    explanation:
      "훌륭한 코치는 겉으로 드러난 말(Text) 이면의 진짜 마음(Context)과 핵심 욕구를 섬세하게 알아차려야 합니다.",
  },
  {
    id: 36,
    originalId: 30,
    module: "모듈 3",
    difficulty: "중",
    question:
      "'내가 가진 신념 알아차리기' 활동의 1단계에서 팀원들과 함께 이야기 나누는 핵심 주제 는?",
    options: [
      "내가 가장 싫어하는 사람의 성격",
      "인생에서 가장 중요한 것 3가지",
      "과거에 겪었던 가장 슬픈 기억",
      "타인에게 들었던 가장 큰 칭찬",
    ],
    answer: 1,
    explanation:
      "자신이 무엇을 중요하게 여기는지(가치관)를 탐색함으로써, 그 기저에 굳건히 깔린 신념을 발견할 수 있습니다.",
  },
  {
    id: 37,
    originalId: 31,
    module: "모듈 3",
    difficulty: "상",
    question:
      "고객이 불편한 감정(정서)을 표현했을 때, 코치가 가져야 할 전문적인 태도로 가장 알맞 은 것은?",
    options: [
      "불편한 감정은 코칭에 방해되므로 즉시 이성적인 사고로 전환하도록 지시한다.",
      "고객의 불편한 감정을 있는 그대로 받아들 이며 이를 중요한 코칭의 '자원'으로 다룬다.",
      "코치도 함께 분노하며 특정 대상을 원망한다.",
      "고객의 감정을 코치의 도덕적 기준에 따라 옳고 그름을 훈계한다.",
    ],
    answer: 1,
    explanation:
      "불편한 감정 이면에는 충족되지 않은 욕구나 신념이 숨어 있으므로, 이를 외면하지 않고 코칭의 훌 륭한 자원(단서)으로 다루어야 합니다.",
  },
  {
    id: 38,
    originalId: 32,
    module: "모듈 3",
    difficulty: "상",
    question:
      "1:1로 짝을 지어 진행하는 '신념에 반박하기 연습'의 주된 목적은 무엇인가?",
    options: [
      "서로의 논리력을 겨루어 승패를 가르기 위함",
      "타인의 신념을 억지로 깨부수고 모욕감을 주기 위함",
      "자신이 가진 고정된 신념을 합리적으로 의 심해보고 또 다른 관점을 수용하여 유연성을 기르기 위함",
      "신념이 전혀 중요하지 않음을 증명하기 위함",
    ],
    answer: 2,
    explanation:
      "자신의 절대 적인 신념에 타인의 합리적 반박을 가해봄으로써, 갇힌 사고에서 벗어나 관점의 전환과 깊은 성찰을 얻기 위함입니다.",
  },
  {
    id: 39,
    originalId: 33,
    module: "모듈 3",
    difficulty: "하",
    question:
      "'나는 내가 가진 [ ]의 총합이다!' 빈칸에 들어갈 NLP의 핵심 개념은 무엇인가?",
    options: ["스펙", "재산", "신념", "약점"],
    answer: 2,
    explanation:
      "우리가 무의식적으로 굳게 믿고 있는 '신념' 체계들이 촘촘히 모여 현재의 나와 내 행동 패턴을 결정짓는다는 의미입니다.",
  },
  {
    id: 40,
    originalId: 34,
    module: "모듈 3",
    difficulty: "중",
    question:
      "다음 중 코치가 알아차림(Awareness)을 유지해야 할 내면적 대상으로 교안에 언급되지 않은 것은?",
    options: [
      "고객이 보이는 미세한 신체 반응",
      "고객이 지금 순간 무엇을 느끼고 있는가",
      "고객에게 현재 작동 중인 신념 체계",
      "고 객이 다니는 회사의 객관적인 재무 상태",
    ],
    answer: 3,
    explanation:
      "알아차림은 외부의 팩트나 정보 조사가 아니라, 고객 내면에서 일어나는 감 정, 생각, 신체반응, 신념을 자각하는 것에 온전히 초점을 맞춥니다.",
  },
  {
    id: 41,
    originalId: 35,
    module: "모듈 3",
    difficulty: "상",
    question:
      "'나는 고객의 말(text)보다 마음(context)을 듣고 있는가?'라는 성찰 질문이 의미하는 바 는?",
    options: [
      "고객이 말하는 단어의 사전적 의미만을 정확히 분석해야 한다.",
      "표면적인 언어적 진술을 넘어서, 그 안에 담긴 진짜 감정과 의 도, 맥락을 파악해야 한다.",
      "고객의 말은 모두 방어기제이므로 절대 믿어서는 안 된다.",
      "대화를 녹음하여 텍스트로 변환하는 물리적 작업이 가 장 중요하다.",
    ],
    answer: 1,
    explanation:
      "Text(표면적 내용)에 매몰되지 않고 Context(행간의 의미, 심리적 배경)를 폭넓게 경청하는 것이 정서 알 아차림의 핵심입니다.",
  },
  {
    id: 42,
    originalId: 36,
    module: "모듈 3",
    difficulty: "중",
    question:
      "감정 알아차림과 관련하여 코치가 스스로에게 던져야 할 성찰 질문으로 가장 적절한 것 은?",
    options: [
      "나는 고객의 감정 표현을 내 잣대로 판단하지 않고 있는 그대로 받아들이고 있는가?",
      "나는 어떻게 하면 고객보다 더 말을 논리 적으로 잘할 수 있을까?",
      "고객의 문제를 내 인맥을 동원해 어떻게 단번에 해결해 줄까?",
      "고객이 오늘 유독 말을 더듬는 이유는 지적 수준이 낮아서가 아닐까?",
    ],
    answer: 0,
    explanation:
      "감정에 대한 철저한 수용과 판단 유보(비판단적 태도)는 정서를 다루는 코치의 가장 기본적이고 필 수적인 성찰 항목입니다.",
  },
  {
    id: 43,
    originalId: 37,
    module: "모듈 4",
    difficulty: "하",
    question: "정서의 개념에 대한 설명 중 거리가 먼 것은?",
    options: [
      "정서는 우리 행동의 안내자 역할 을 한다.",
      "정서는 자동화된 반응 체계이다.",
      "정서는 범위가 넓고 중립적인 개념이다.",
      "정서는 느낌에서 생긴 마음으로, 주로 부정적 맥락에서 사용된다.",
    ],
    answer: 3,
    explanation:
      "정서는 자동화된 반응체계이고 균형점을 찾아 스스로 조정하며 지속적으로 재구성되고 중립적인 개념이다.",
  },
  {
    id: 44,
    originalId: 37,
    module: "모듈 4",
    difficulty: "중",
    question:
      "커리어 코칭 장면에서 정서 알아차림을 잘 하고 있는 코치의 모습으로서 적절하지 않은 것 은?",
    options: [
      "고객의 이야기를 온몸으로 경청한다.",
      "고객이 표현하는 정서 이면에 또다른 정서가 섞여 있을 가능성을 탐색한다.",
      "고객의 부 정적인 감정은 제한하고, 부정적인 정서는 긍정적인 정서로 변화시킬 수 있도록 돕는다.",
      "고객이 스스로 자기 신념의 작동을 알아차리도록 돕고, 부정적이거나 비합리적인 신념을 알아차리도록 돕는다.",
    ],
    answer: 2,
    explanation:
      "코치는 고객이 자신의 정서를 스스로 인식하도록 도와주어야 한다.",
  },
  {
    id: 45,
    originalId: 37,
    module: "모듈 4",
    difficulty: "하",
    question:
      "커리어(Career)의 어원인 라틴어 '카루스(Carrus)'가 내포하는 본래 의미로 가장 적절한 것 은?",
    options: [
      "전쟁터에서 승리하여 획득한 전리품",
      "마차 또는 마차가 굴러간 바퀴 자국",
      "한 직장에 평생 머무르며 얻는 보상",
      "신이 부여한 바꿀 수 없는 운명",
    ],
    answer: 1,
    explanation:
      "커리어는 마차를 뜻하는 라틴어 카루스에서 유래하여, 개인이 일생에 걸쳐 지나온 일과 경험의 궤 적(여정)을 의미합니다.",
  },
  {
    id: 46,
    originalId: 38,
    module: "모듈 4",
    difficulty: "중",
    question:
      "직업(Job)과 커리어(Career)의 개념 차이를 설명한 것으로 가장 올바른 것은?",
    options: [
      "직업은 생애 전반의 여정이며, 커리어는 특정 시점의 돈벌이 수단이다.",
      "직업은 수행하는 구체적인 과업이나 일자리를 뜻하고, 커리어는 일생 에 걸친 경험과 성장의 총체적 궤적을 뜻한다.",
      "두 개념은 완전히 동일하여 학술적으로 구분하지 않는다.",
      "직업은 주관적 만족을, 커리어는 객 관적 연봉만을 의미한다.",
    ],
    answer: 1,
    explanation:
      "직업(Job)이 단기적이고 구체적인 과업이라면, 커리어(Career)는 일과 관련된 생애 전반의 경 험을 포괄하는 넓은 개념입니다.",
  },
  {
    id: 47,
    originalId: 40,
    module: "모듈 4",
    difficulty: "상",
    question:
      "크롬볼츠의 '계획된 우연(Planned Happenstance) 이론'이 커리어 코칭에 주는 핵심 시 사점은 무엇인가?",
    options: [
      "우연은 통제할 수 없으므로 진로 계획을 세우는 것은 무의미하다.",
      "예측 불가능한 우연한 사건을 호기심, 인내심, 유연성을 통해 긍정적인 커리어 기회로 창출해야 한다.",
      "타고난 운명이나 운이 진로 성공의 100%를 결정한다.",
      "모든 변수를 완벽하게 통제하 는 철저한 장기 계획만이 성공을 보장한다.",
    ],
    answer: 1,
    explanation:
      "계획된 우연 이론은 예기치 않은 사건을 기회로 만들기 위해 열린 태도와 탐색적 행동을 강조합니다.",
  },
  {
    id: 48,
    originalId: 41,
    module: "모듈 4",
    difficulty: "중",
    question:
      "성인학습이론(Andragogy)의 원리를 커리어 코칭에 적용할 때 올바른 접근 방식은?",
    options: [
      "성인은 학습 시 타율적 지시를 선호하므로 코치가 일방적으로 정답을 알려준다.",
      "성인은 풍부한 경험을 지녔으나 이는 학습의 방해물 이 되므로 배제한다.",
      "자신의 실제 삶이나 직무의 당면 과제 해결과 직접 연관될 때 내재적 동기가 유발되어 적극적으로 학습한다.",
      "성인은 내 재적 만족보다 승진, 보너스 등 외재적 보상에 의해서만 움직인다.",
    ],
    answer: 2,
    explanation:
      "성인 학습자는 자기주도적이며, 문제 중심적이고 경 험을 중요한 자원으로 활용합니다.",
  },
  {
    id: 49,
    originalId: 42,
    module: "모듈 4",
    difficulty: "중",
    question: "다음 중 용어에 대한 설명이 잘못 연결된 것은 무엇인가?",
    options: [
      "코칭(Coaching): 코치와 코칭 을 받는 사람이 파트너를 이루며, 주로 코치는 해당분야의 전문가로서 후배나 고객에게 정보나 조언을 제공하는 것",
      "멘토링(Mentoring) : 풍부한 경험과 지혜를 겸비한 사람이 멘티에게 지도와 조언을 통하여 성장시키는 것",
      "직업상담 : 취업 및 재취업을 목표로, 취업정보의 탐색과 현실에 적합한 취업계획을 세우는 것 을 지원하며, 효과적인 구직활동을 수행할 수 있도록 조언을 제공하는 것",
      "컨설팅(Consulting): 특정 분야에 대한 지식이나 정보, 전문성(expertise) 등을 바탕으 로 의뢰인(client)에게 자문이나 조언을 제공하는 것",
    ],
    answer: 0,
    explanation:
      "코칭(Coaching)이란 코치와 코칭을 받는 사람이 수평적인 파트너 관계를 이루 며, 주로 코치는 해당분야의 전문지식이 없어도 코칭이 가능하다.",
  },
  {
    id: 50,
    originalId: 43,
    module: "모듈 4",
    difficulty: "상",
    question:
      "에드가 샤인이 제시한 '경력 닻(Career Anchor)'의 의미로 가장 적절한 것은?",
    options: [
      "개인이 직업을 선택할 때 어떠한 상황에서도 결코 포기할 수 없는 핵심 가치와 동기",
      "경력이 단절되어 더 이상 성장하지 못하고 정체된 상태",
      "커리어 발전을 가로막는 외부의 환경적 장애물",
      "은퇴 후의 노후 자금을 마련하기 위한 재무적 목표",
    ],
    answer: 0,
    explanation:
      "배가 닻을 내리 듯, 자율성, 전문성, 안정성 등 개인의 커리어 선택을 굳건히 지탱해 주는 내적 동기와 자아상을 뜻합니다.",
  },
  {
    id: 51,
    originalId: 43,
    module: "모듈 4",
    difficulty: "상",
    question:
      "사비카스의 진로구성주의 이론에서 개인이 급변하는 진로 환경에 대처하는 '진로적응성 4C'에 속하지 않는 것은?",
    options: [
      "관심 (Concern)",
      "통제 (Control)",
      "경쟁 (Competition)",
      "호기심 (Curiosity)",
    ],
    answer: 2,
    explanation:
      "진로 적응성 4C는 관심(Concern), 통제(Control), 호기심(Curiosity), 자신감(Confidence)입니다.",
  },
  {
    id: 52,
    originalId: 44,
    module: "모듈 4",
    difficulty: "하",
    question: "커리어 코칭의 철학적 전제로 가장 올바른 것은?",
    options: [
      "인간은 본래 수동적이므로 강한 통제가 필요하다.",
      "고객은 스스로 문제를 해결할 수 있는 온전하고 창의적인 존재이다.",
      "코치의 전문적인 지식과 지시가 고객의 생각보다 항상 우위에 있다.",
      "인간의 적성과 한계는 태어날 때 결정되어 코칭으로 변하지 않는다.",
    ],
    answer: 1,
    explanation:
      "코칭은 고객이 해답을 내부 에 가지고 있는 온전한 존재임을 전제로 파트너십을 형성합니다.",
  },
  {
    id: 53,
    originalId: 45,
    module: "모듈 4",
    difficulty: "중",
    question:
      "물리적인 국경이나 부서, 조직의 경계를 넘어 자유롭게 이동하며 개인의 역량을 발휘하 는 현대의 커리어 패러다임을 무엇이라 하는가?",
    options: [
      "수직적 커리어",
      "전통적 커리어",
      "무경계 커리어 (Boundaryless Career)",
      "사일로 커 리어 (Silo Career)",
    ],
    answer: 2,
    explanation:
      "무경계 커리어는 한 조직에 얽매이지 않고 유연하게 경계를 넘나들며 경력을 개발하는 형태입니 다.",
  },
  {
    id: 54,
    originalId: 46,
    module: "모듈 4",
    difficulty: "중",
    question:
      "커리어 '코칭'과 '컨설팅/상담'의 가장 핵심적인 차이점은 무엇인가?",
    options: [
      "컨설팅은 고객이 스스로 해답을 찾도록 질문하고, 코칭은 전문가가 해결책을 직접 제시한다.",
      "코칭은 현재와 미래의 가능성에 초점을 맞추어 자율성을 촉 진하고, 컨설팅은 전문가의 진단과 해결책 제공에 초점을 맞춘다.",
      "코칭은 오직 과거의 상처 치유에만 전념한다.",
      "컨설팅은 무료이고 코칭은 유료 서비스이다.",
    ],
    answer: 1,
    explanation:
      "코칭은 질문을 통해 고객 내부의 해답을 이끌어내고, 컨설팅은 외부 전문가로서 솔루션을 제공하는 차이가 있습니다.",
  },
  {
    id: 55,
    originalId: 47,
    module: "모듈 4",
    difficulty: "하",
    question:
      "조직 내 커리어 코칭 진행 시 준수해야 할 코치의 윤리 강령으로 알맞은 것은?",
    options: [
      "코칭 성과를 위해 고객의 동의 없이 인사팀에 민감한 상담 내용을 보고한다.",
      "고객이 불법 행위를 고백하더라도 절대 예외 없이 비밀 을 유지한다.",
      "비밀 유지의 한계를 사전에 명확히 고지하고, 이해상충 상황을 투명하게 다룬다.",
      "친밀감을 높이기 위해 고객과 금전적 거래 등 이중관계를 형성한다.",
    ],
    answer: 2,
    explanation:
      "비밀 유지는 필수적이나 불법이나 위험 상황 등 예외 한계를 계약 초기에 명확히 합의해야 합니 다.",
  },
  {
    id: 56,
    originalId: 48,
    module: "모듈 4",
    difficulty: "상",
    question:
      "조직에서 커리어 코칭을 도입할 때 개인과 조직 간의 '정렬(Alignment)'을 가장 잘 설명 한 것은?",
    options: [
      "개인의 목표를 완전히 버리고 조직의 이익만을 따르게 세뇌하는 것",
      "조직의 요구와 무관하게 개인이 원하는 바만 무조건 지원하는 것",
      "개인의 커리어 비전과 강점이 조직의 비전 및 당면 과제와 시너지를 낼 수 있는 교집합을 탐색하는 것",
      "조직과 개인의 목표를 별개로 분리하여 코칭하는 것",
    ],
    answer: 2,
    explanation:
      "효과적인 사내 커리어 코칭은 조직의 성과 창출과 개인의 성장이 맞물려 돌아가는 접점 (Alignment)을 찾아야 합니다.",
  },
  {
    id: 57,
    originalId: 49,
    module: "모듈 5",
    difficulty: "하",
    question:
      "일반적인 커리어 코칭 프로세스의 '초기(접수 및 계약) 단계'에서 가장 핵심적인 과업은 무엇인가?",
    options: [
      "구체적인 실행 계획의 점검",
      "의사결정 대차대조표 작성",
      "코칭의 목표 설정과 라포(Rapport) 형성",
      "종결 및 사후 관리 (Follow-up) 일정 수립",
    ],
    answer: 2,
    explanation:
      "초기 단계에서는 상호 신뢰 관계를 구축하고 코칭을 통해 달성할 목표와 주제를 명확히 합의합 니다.",
  },
  {
    id: 58,
    originalId: 50,
    module: "모듈 5",
    difficulty: "중",
    question:
      "고객이 직업을 선택할 때 무엇을 가장 중요하게 생각하는지 파악하기 위해 활용하는 대 표적인 코칭 도구는?",
    options: [
      "직업가치관 카드(Value Card) 분류",
      "다면평가(360도 피드백)",
      "이력서 양식",
      "시간 관리 매트릭스",
    ],
    answer: 0,
    explanation:
      "가치관 카드 분류는 고객의 내적 동기와 직업적 우선순위(가치)를 시각화하여 탐색하는 유용한 도구입니다.",
  },
  {
    id: 59,
    originalId: 51,
    module: "모듈 5",
    difficulty: "중",
    question:
      "홀랜드(Holland)의 직업흥미유형 6가지(RIASEC)에 포함되지 않는 것은?",
    options: [
      "실재 형 (Realistic)",
      "탐구형 (Investigative)",
      "진취형 (Enterprising)",
      "감정형 (Feeling)",
    ],
    answer: 3,
    explanation:
      "홀랜드의 6가지 유형은 실재형, 탐구 형, 예술형(A), 사회형(S), 진취형, 관습형(C)입니다.",
  },
  {
    id: 60,
    originalId: 52,
    module: "모듈 5",
    difficulty: "상",
    question:
      "도널드 수퍼(Donald Super)의 '생애진로무지개(Life-Career Rainbow)' 도구를 활용하여 얻 을 수 있는 통찰로 가장 적절한 것은?",
    options: [
      "직무에 필요한 하드 스킬(Hard Skill) 수준의 정량적 측정",
      "개인이 생애 발달 단계별로 수행하 는 다중적인 역할(자녀, 학생, 여가인, 시민, 직업인 등) 간의 균형과 조화 탐색",
      "동료들과의 성과 비교 및 서열 확인",
      "자신의 성격 유형과 타인 의 성격 유형 간의 갈등 원인 분석",
    ],
    answer: 1,
    explanation:
      "생애진로무지개는 일생 동안 개인이 맡는 다양한 역할들의 시기별 비중을 시각화 하여 생애 균형을 조망하는 도구입니다.",
  },
  {
    id: 61,
    originalId: 53,
    module: "모듈 5",
    difficulty: "중",
    question:
      "커리어 코칭 중기 단계에서 여러 진로 대안 중 하나를 선택해야 할 때, 각 대안의 긍정 적/부정적 결과를 나와 타인의 관점에서 비교 분석하는 도구는?",
    options: [
      "의사결정 대차대조표 (Decision Balance Sheet)",
      "MBTI 성격유형검사",
      "마인드맵",
      "조해리의 창",
    ],
    answer: 0,
    explanation:
      "의사결정 대차대조표는 대안별로 예상되는 득실을 체계적으로 분석하여 합리적 의사결정 을 돕는 도구입니다.",
  },
  {
    id: 62,
    originalId: 54,
    module: "모듈 5",
    difficulty: "상",
    question:
      "고객의 핵심 역량을 도출하기 위해 과거에 성공적으로 과업을 수행했던 구체적인 경험을 심층 질문하는 인터뷰 기법은?",
    options: [
      "스트레스 면접 (Stress Interview)",
      "행동사건면접 (BEI: Behavioral Event Interview)",
      "압박 면접 (Pressure Interview)",
      "집단 토론 면접",
    ],
    answer: 1,
    explanation:
      "BEI는 STAR 기법을 활용하여 과거의 구체적인 행동 사건을 탐색함으로써 고객 의 실제 역량과 강점을 파악하는 기법입니다.",
  },
  {
    id: 63,
    originalId: 55,
    module: "모듈 5",
    difficulty: "중",
    question:
      "강점 및 성격 진단 도구(예: 강점진단, MBTI 등)를 커리어 코칭에 활용할 때 코치가 주의 해야 할 사항으로 알맞은 것은?",
    options: [
      "진단 결과로 고객의 한계와 직업을 단정 지어 라벨링(Labeling)하지 않는다.",
      "진단 결과가 코칭 대화 보다 항상 절대적으로 정확하다고 믿게 한다.",
      "부족한 약점을 집중적으로 찾아내어 비판하는 도구로 쓴다.",
      "고객의 해석과 무관하게 진단 매뉴 얼대로만 기계적으로 해설한다.",
    ],
    answer: 0,
    explanation:
      "진단 도구는 자아 탐색을 돕는 보조 수단일 뿐, 결과의 틀에 고객을 가두거나 한정 짓 는 라벨링 오류를 범해서는 안 됩니다.",
  },
  {
    id: 64,
    originalId: 56,
    module: "모듈 5",
    difficulty: "하",
    question:
      "최종적인 커리어 목표를 중심에 두고, 이를 달성하기 위해 필요한 중간 목표와 실행 전 략을 단계별로 시각화하여 계획하는 도구를 무엇이라 하는가?",
    options: [
      "근로계약서",
      "커리어 로드맵 (Career Roadmap)",
      "조직도",
      "직무 기술 서",
    ],
    answer: 1,
    explanation:
      "커리어 로드맵은 목표 달성을 위한 경로와 마일스톤을 시각적으로 설계하는 도구입니다.",
  },
  {
    id: 65,
    originalId: 57,
    module: "모듈 5",
    difficulty: "하",
    question:
      "커리어코칭 프로세스의 '종결 단계'에서 이루어지는 주요 활동으로 적절하지 않은 것은?",
    options: [
      "코칭 목표의 달성 여부 및 성과 점검",
      "코칭 과정을 통한 고객의 통찰과 배움 요약",
      "전혀 새로운 코칭 목표의 재설정 및 탐색 시작",
      "실행 유지를 위한 사후 관리(Follow-up) 방안 논의",
    ],
    answer: 2,
    explanation:
      "종결 단계에서는 새로운 목표를 시작하기보다 성과를 축하하고 실 행을 유지하기 위한 방안을 정리하는 데 집중해야 합니다.",
  },
  {
    id: 66,
    originalId: 58,
    module: "모듈 5",
    difficulty: "상",
    question:
      "전직지원(Outplacement) 코칭을 수행할 때 코치가 가장 우선적으로 다루어야 할 내면적 과업은 무엇인가?",
    options: [
      "퇴직에 따른 상실감, 분노 등 감정의 수용과 심리적 안정 지원",
      "무조건적으로 가장 높은 연봉을 주는 회사 리스트 제공",
      "면접용 자기소개서 기계적 대필",
      "이전 직장에 대한 법적 소송 준비",
    ],
    answer: 0,
    explanation:
      "비자발적 퇴직자 코칭 시에는 구직 스킬 이전에 퇴직으로 인한 심리적 충격을 완화하고 자존감을 회복하는 정서적 지원이 선행되어야 합니다.",
  },
  {
    id: 67,
    originalId: 59,
    module: "모듈 5",
    difficulty: "중",
    question:
      "커리어 목표 달성 전략을 세울 때, 고객의 강점, 약점, 기회, 위협 요인을 분석하는 도구 는?",
    options: ["SWOT 분석", "PEST 분석", "SMART 기법", "R-GROWS 모델"],
    answer: 0,
    explanation:
      "SWOT 분석은 내부 역량과 외부 환경을 종합적으로 분석하여 커리어 전략을 수립하는 데 유용합니다.",
  },
  {
    id: 68,
    originalId: 60,
    module: "모듈 5",
    difficulty: "중",
    question:
      "이력서 및 자기소개서 작성 코칭 시 코치의 올바른 역할로 가장 적절한 것은?",
    options: [
      "문맥이 매끄럽도록 코치가 직접 글을 대신 써준다.",
      "고객의 경험 속에서 강점과 직무 역량이 잘 드러나도록 스토리텔링을 촉진하는 질문을 던 진다.",
      "합격자의 자기소개서를 그대로 베껴 쓰도록 유도한다.",
      "경력을 과장하거나 허위 사실을 추가하여 매력적으로 포장해준다.",
    ],
    answer: 1,
    explanation:
      "코치는 대필자가 아니라, 고객 스스로 경험의 가치를 발견하고 역량을 구조화하여 표현하도록 돕는 조력자입니다.",
  },
  {
    id: 69,
    originalId: 61,
    module: "모듈 6",
    difficulty: "하",
    question:
      "코칭에서 '피드백(Feedback)'과 비교하여 '피드포워드(Feedforward)'가 가지는 가장 큰 특 징은 무엇인가?",
    options: [
      "과거의 실패 원인을 철저히 규명한다.",
      "잘못된 행동에 대한 책임 소재를 가린다.",
      "과거에 얽매이지 않고 미래의 해 결책과 가능성에 초점을 맞춘다.",
      "코치가 일방적으로 해결책을 지시한다.",
    ],
    answer: 2,
    explanation:
      "피드백이 과거의 행동을 거울처럼 비춰주는 것이라면, 피드포워드는 앞으로 나아갈 방향(미래)에 집중하는 긍정적 소통 방식입니다.",
  },
  {
    id: 70,
    originalId: 62,
    module: "모듈 6",
    difficulty: "상",
    question:
      "효과적인 피드백을 제공하기 위한 SBI 모델의 구성 요소가 올바르게 나열된 것은?",
    options: [
      "Situation (상황) - Behavior (행동) - Impact (영향)",
      "Story (스토리) - Belief (신념) - Idea (아이디어)",
      "Skill (기술) - Behavior (행동) - Improvement (개선)",
      "System (시스템) - Background (배경) - Issue (이슈)",
    ],
    answer: 0,
    explanation:
      "특정 상황(S)에서 상대방이 한 구체적인 행동(B)과 그로 인해 발생한 영향/결과(I)를 객관적으로 전달하는 피드백 모델입니다.",
  },
  {
    id: 71,
    originalId: 63,
    module: "모듈 6",
    difficulty: "하",
    question:
      "상대방의 긍정적인 행동과 성과를 강화하기 위해 칭찬과 인정을 제공하는 피드백의 유형 은?",
    options: [
      "교정적 피드백 (Corrective Feedback)",
      "지지적 피드백 (Supportive Feedback)",
      "평가적 피드백 (Evaluative Feedback)",
      "부정적 피드백 (Negative Feedback)",
    ],
    answer: 1,
    explanation:
      "지지적 피드백은 고객의 동기와 자신감을 높이고 바람직한 행동을 유지/강화하는 역할을 합니다.",
  },
  {
    id: 72,
    originalId: 64,
    module: "모듈 6",
    difficulty: "중",
    question:
      "발전을 위한 교정적 피드백(Constructive Feedback)을 제공할 때 준수해야 할 원칙으로 가장 적절한 것은?",
    options: [
      "상대방의 인격과 성격을 직접적으로 비판한다.",
      "사람이 아닌 관찰된 구체적인 '행동'에 초점을 맞추어 전달한다.",
      "'항상', '절대'와 같은 극단적인 단어를 사용하여 경각심을 준다.",
      "다른 사람들과 공개적으로 비교하며 피드백한다.",
    ],
    answer: 1,
    explanation:
      "교 정적 피드백은 성격이나 의도를 추측하여 비난하는 대신, 객관적으로 관찰 가능한 행동에 대해서만 구체적으로 이루어져야 방어기제를 줄일 수 있습니다.",
  },
  {
    id: 73,
    originalId: 65,
    module: "모듈 6",
    difficulty: "상",
    question:
      "조해리의 창(Johari Window) 모델에서 코칭 피드백을 통해 타인은 알지만 나는 몰랐던 ' 맹인 영역(Blind Area)'을 줄이면 상대적으로 넓어지는 영역은 어디인가?",
    options: [
      "미지 영역 (Unknown Area)",
      "숨겨진 영역 (Hidden Area)",
      "열린 영역 (Open Area)",
      "폐쇄 영역 (Closed Area)",
    ],
    answer: 2,
    explanation:
      "피드백을 수용하여 자신의 맹점을 깨닫고, 자기를 개방함으로써 상 호 소통이 원활한 '열린 영역(Open Area)'이 확장됩니다.",
  },
  {
    id: 74,
    originalId: 66,
    module: "모듈 6",
    difficulty: "중",
    question:
      "상대방의 행동이 나에게 미친 영향과 내 감정을 비난 없이 전달하는 'I-Message(나 전달 법)'의 3요소로 알맞은 것은?",
    options: [
      "상대의 과거 실수 - 나의 분노 - 명령",
      "구체적인 행동 - 그 행동이 미친 영향 - 나의 감정",
      "타인의 험 담 - 나의 의견 - 지시",
      "상황 모면 - 책임 전가 - 타협",
    ],
    answer: 1,
    explanation:
      "나 전달법은 '네가 ~해서(행동), 나에게 ~한 문제가 생겼고(영 향), 그래서 나는 ~게 느낀다(감정)'의 구조로 부드럽게 메시지를 전달합니다.",
  },
  {
    id: 75,
    originalId: 67,
    module: "모듈 6",
    difficulty: "하",
    question:
      "피드백을 받을 때 사람들이 수용하지 못하고 방어적으로 반응하게 되는 주된 원인으로 보기 어려운 것은?",
    options: [
      "피드백을 자신의 인격에 대한 공격으로 받아들여서",
      "피드백을 주는 사람과의 신뢰(라포)가 부족해서",
      "피드백 내 용이 구체적인 행동 기반이 아니라 모호한 평가여서",
      "피드백이 본인의 발전에 큰 도움이 될 것 같아서",
    ],
    answer: 3,
    explanation:
      "본인의 발전 에 도움이 된다고 진심으로 인지하면 방어기제가 낮아지고 수용성이 높아집니다.",
  },
  {
    id: 76,
    originalId: 68,
    module: "모듈 6",
    difficulty: "중",
    question:
      "부정적인 피드백을 전달할 때 충격을 완화하기 위해 '긍정적 칭찬 - 개선점 피드백 - 긍 정적 격려'의 순서로 제공하는 기법을 무엇이라 하는가?",
    options: [
      "샌드위치 피드백 (Sandwich Feedback)",
      "침묵 기법",
      "앵커링 기법",
      "미러링 기법",
    ],
    answer: 0,
    explanation:
      "샌드위치 기법은 개선점을 양쪽의 긍정적인 메시지로 감싸서 수용성을 높이는 커뮤니케이션 스킬입니다.",
  },
  {
    id: 77,
    originalId: 69,
    module: "모듈 6",
    difficulty: "상",
    question:
      "마셜 골드스미스의 '피드포워드(Feedforward)' 실습 원칙 중, 제안을 듣는 사람이 반드시 지켜야 할 규칙으로 가장 알맞은 것은?",
    options: [
      "제안의 논리적 오류를 즉시 반박한다.",
      "과거에 왜 그렇게 하지 못했는지 변명한다.",
      '상대방 의 제안을 판단하지 않고 오직 경청한 뒤 "감사합니다"라고만 대답한다.',
      "상대방에게 더 나은 해결책을 역으로 제시한다.",
    ],
    answer: 2,
    explanation:
      "피드포워드를 받을 때는 아이디어를 비판하거나 변명하지 않고 열린 마음으로 수용하는 태도(감사 인사)가 가장 중요합니다.",
  },
  {
    id: 78,
    originalId: 70,
    module: "모듈 6",
    difficulty: "하",
    question: "피드백 대화 시 코치가 절대 사용을 피해야 할 언어 습관은?",
    options: [
      '"제가 관찰한 바로는~"',
      '"당신은 항상 그런 식이에요."',
      '"이 행동이 이런 결과를 가져왔네요."',
      '"앞으로 어떻게 다르게 해보고 싶나요?"',
    ],
    answer: 1,
    explanation:
      "'항상', '절대'와 같은 단정적이고 과장된 언어는 상대의 방어벽을 높이고 대화를 단절시킵니다.",
  },
  {
    id: 79,
    originalId: 71,
    module: "모듈 6",
    difficulty: "중",
    question:
      "피드백 제공 후 실행 여부를 지속적으로 확인하고 다음 목표로 연결하는 순환 과정을 뜻 하는 용어는?",
    options: [
      "피드백 루프 (Feedback Loop)",
      "역전이",
      "라포 형성",
      "아이스 브레이킹",
    ],
    answer: 0,
    explanation:
      "피드백은 일회성 이 벤트가 아니라, 실행-피드백-개선이 반복되는 피드백 루프를 통해 지속적 성장을 만들어냅니다.",
  },
  {
    id: 80,
    originalId: 72,
    module: "모듈 6",
    difficulty: "상",
    question:
      "성공적인 피드백 세션을 위해 코치가 취해야 할 '적극적이고 건설적인 반응(Active Constructive Responding)'의 특징은?",
    options: [
      "상대방의 좋은 소식을 축하하되 대화는 빨리 끝낸다.",
      "상대의 긍정적인 성과에 대해 눈을 맞추 고 진심으로 열의를 보이며 구체적인 질문을 통해 기쁨을 증폭시킨다.",
      "잘한 점보다 부족한 점을 짚어주는 데 집중한다.",
      "아무런 감정적 동요 없이 건조하게 수고했다고만 말한다.",
    ],
    answer: 1,
    explanation:
      "ACR(적극적-건설적 반응)은 상대의 성취를 깊이 인정하고 에너지를 높여주어 상 호 신뢰와 동기를 극대화하는 최고의 반응 방식입니다.",
  },
  {
    id: 81,
    originalId: 73,
    module: "모듈 7",
    difficulty: "하",
    question:
      "구직을 위한 이력서 작성 시 가장 중요하게 고려해야 할 원칙은 무엇인가?",
    options: [
      "자신의 모든 성장 과정을 빠짐없이 길게 서술한다.",
      "지원하는 직무와의 연관성(직무 적합성)을 중심으로 작성한다.",
      "경쟁자보다 돋보이도록 허 위 사실을 약간 섞어 과장한다.",
      "디자인을 화려하게 꾸미는 데 대부분의 시간을 투자한다.",
    ],
    answer: 1,
    explanation:
      "이력서와 자기소개서는 본 인이 해당 직무를 수행하기에 가장 적합한 역량을 갖춘 인재임을 증명하는 서류이므로 직무 연관성이 최우선입니다.",
  },
  {
    id: 82,
    originalId: 74,
    module: "모듈 7",
    difficulty: "중",
    question:
      "경력기술서 작성 시 코치가 조언해야 할 올바른 방향으로 가장 적절한 것은?",
    options: [
      "가장 오래된 과거의 경력부터 순차적으로 나열한다.",
      "최근 경력을 중심으로, 본인의 역할과 정량적 성과를 구체적으로 기술한다.",
      "수행했던 모든 단순 업무를 빠짐없이 나열하여 분량을 늘린다.",
      "성과보다는 직장에서 겪은 인간관계의 어려움을 중심으로 작성한다.",
    ],
    answer: 1,
    explanation:
      "경력기술서는 최신 경력순(역순)으로 작성하며, 본인이 무엇을 하여 어떤 성과(수치화)를 내었는지 명확하게 보여주어야 합니다.",
  },
  {
    id: 83,
    originalId: 75,
    module: "모듈 7",
    difficulty: "상",
    question:
      "역량기반면접(CBI: Competency Based Interview)의 핵심 전제는 무엇인가?",
    options: [
      "지원자의 외모와 첫인상이 합격을 결정한다.",
      "지원자의 과거 행동 패턴이 미래의 행동과 성과를 가장 잘 예측하는 지표이다.",
      "압박 질문을 통 해 지원자의 스트레스 임계점을 찾아내는 것이 목적이다.",
      "전공 지식과 학점을 테스트하는 데 100% 초점을 맞춘다.",
    ],
    answer: 1,
    explanation:
      "역량기반면접은 '과거의 행동이 미래의 행동을 예측한다'는 전제하에 지원자의 과거 경험(STAR)을 깊이 있게 분석합니다.",
  },
  {
    id: 84,
    originalId: 76,
    module: "모듈 7",
    difficulty: "하",
    question:
      "대상자의 과거의 행동 사례를 통해 사실 정보를 획득하여 역량을 평가하는 도구를 무엇이라고 하 는가?",
    options: [
      "Assessment Center",
      "Work sample test",
      "Reference check",
      "BEI",
    ],
    answer: 3,
    explanation:
      "BEI는 Behavioral Event Interview의 약 자로 대상자의 과거행동을 묻는 도구이다.",
  },
  {
    id: 85,
    originalId: 76,
    module: "모듈 7",
    difficulty: "중",
    question:
      "역량기반 코칭클리닉에서 코칭을 실시하기 전에 대상자의 무엇을 파악하여 차별적 코칭에 적용하 는가?",
    options: ["역량과 자질", "학벌", "역량과 자기인식", "과거 경험"],
    answer: 0,
    explanation:
      "코칭을 실시하기 전에 객관적인 역량평가 결과 에 기초하여 대상자의 강/약점을 파악한다. 이때 대상자의 자기인식 내용은 객관적이지 않을 수 있다.",
  },
  {
    id: 86,
    originalId: 76,
    module: "모듈 7",
    difficulty: "하",
    question:
      "대상자의 과거의 행동 사례를 통해 사실 정보를 획득하여 역량을 평가하는 도구를 무엇이라고 하는 가?",
    options: [
      "Assessment Center",
      "Work sample test",
      "Reference check",
      "BEI",
    ],
    answer: 3,
    explanation:
      "BEI는 Behavioral Event Interview의 약자 로 대상자의 과거행동을 묻는 도구이다.",
  },
  {
    id: 87,
    originalId: 77,
    module: "모듈 7",
    difficulty: "중",
    question:
      "자기소개서 작성 코칭 시, 경험을 체계적으로 구조화하는 STAR 기법의 구성 요소로 올바 른 것은?",
    options: [
      "상황(Situation) - 과제(Task) - 분석(Analysis) - 보상(Reward)",
      "상황(Situation) - 과제(Task) - 행동(Action) - 결과(Result)",
      "전략(Strategy) - 과제(Task) - 행동(Action) - 결과(Result)",
      "상황(Situation) - 팀워크(Teamwork) - 행동(Action) - 결과(Result)",
    ],
    answer: 1,
    explanation:
      "STAR 기법은 어떤 상황(S)에서 어떤 과제(T)를 맡아, 구체적으로 어떤 행동(A)을 취해, 어떤 결과(R)를 이루었는지 작성하는 공식입 니다.",
  },
  {
    id: 88,
    originalId: 79,
    module: "모듈 7",
    difficulty: "중",
    question:
      "성공적인 '1분 자기소개'를 준비하기 위한 코칭 전략으로 가장 적절하지 않은 것은?",
    options: [
      "자신의 핵심 역량과 직무 기여도를 명확히 포함한다.",
      "자신의 인생사를 출생부터 현재까지 시간순으로 모두 담는다.",
      "면접관의 주의 를 끌 수 있는 흥미로운 키워드나 비유를 활용한다.",
      "지원 회사와 직무에 대한 열정과 연결 고리를 보여준다.",
    ],
    answer: 1,
    explanation:
      "1분이 라는 짧은 시간 동안 전체 인생사를 나열하는 것은 비효율적이며, 직무와 관련된 핵심 역량 1~2가지에 집중해야 합니다.",
  },
  {
    id: 89,
    originalId: 80,
    module: "모듈 7",
    difficulty: "중",
    question:
      "역량평가를 기반으로 하는 코칭 클리닉에서 활용하는 A-GROW 모델에서 A는 무엇의 약자입니까?",
    options: ["Attitude", "Assessment", "Action", "Artificial"],
    answer: 1,
    explanation:
      "역량평가를 기반으로 하는 코칭 클리닉에서는 객관적인 역량평 가 진단이 중요합니다.",
  },
  {
    id: 90,
    originalId: 81,
    module: "모듈 7",
    difficulty: "상",
    question:
      "모의면접(Mock Interview) 후 피드백을 제공할 때, 코치가 활용해야 할 효과적인 기법 은?",
    options: [
      "지원자의 성격적 결함을 찾아내어 날카롭게 비판한다.",
      "평가적인 언어 대신, 관찰 가능한 구체적인 행동(시선, 자세, 답변 구조 등)을 기반으로 교정적 피드백을 제공한다.",
      "무조건 잘했다고만 칭찬하여 안일함을 갖게 한다.",
      "피드백 없이 녹화 영상만 던져주고 알아서 고 치라고 한다.",
    ],
    answer: 1,
    explanation:
      "효과적인 모의면접 피드백은 인신공격이 아닌 '구체적 행동 관찰'에 기반해야 수용성이 높고 실질적인 개 선이 일어납니다.",
  },
  {
    id: 91,
    originalId: 82,
    module: "모듈 7",
    difficulty: "중",
    question:
      "최근 확대되고 있는 AI 면접 및 역량 검사 대비 코칭 시 조언할 내용으로 가장 올바른 것은?",
    options: [
      "AI는 답변의 내용만 평가하므로 표정이나 목소리는 신경 쓰지 않아도 된다.",
      "최대한 기계처럼 감정 없이 차갑게 답변하는 것 이 유리하다.",
      "안면 인식 기술이 시선, 표정, 음성의 떨림 등을 분석하므로 일관성 있고 긍정적인 비언어적 태도를 유지해야 한다.",
      "무조건 길 게 말하여 답변 시간을 꽉 채우는 데만 집중한다.",
    ],
    answer: 2,
    explanation:
      "AI 역량 검사는 지원자의 답변 내용뿐만 아니라 안면 근육의 움직 임, 음성, 시선 처리 등 비언어적 데이터를 종합적으로 분석합니다.",
  },
  {
    id: 92,
    originalId: 83,
    module: "모듈 7",
    difficulty: "상",
    question:
      '구직자가 "나는 반드시 대기업에만 들어가야 해, 그렇지 않으면 내 인생은 실패야"라 고 말할 때, 코치가 다루어야 할 내면적 요소는?',
    options: [
      "비합리적 신념 (Irrational Belief)",
      "확증 편향 (Confirmation Bias)",
      "매몰 비용 오류 (Sunk Cost Fallacy)",
      "후광 효과 (Halo Effect)",
    ],
    answer: 0,
    explanation:
      "인지행동 코칭 관점에서 볼 때, '반드시 ~해야만 한다'는 당위적이고 비 합리적인 신념을 유연한 사고로 전환하도록 도와야 합니다.",
  },
  {
    id: 93,
    originalId: 84,
    module: "모듈 7",
    difficulty: "중",
    question:
      "면접에서 면접관이 지원자의 과거 경험을 더 깊이 파고들어 구체적인 정보를 얻어내기 위해 꼬리를 물고 이어가는 질문 기법을 무엇이라 하는가?",
    options: [
      "클로징 질문",
      "탐침 질문 (Probing Question)",
      "유도 질문",
      "가정형 질문",
    ],
    answer: 1,
    explanation:
      "탐침 기법(Probing)은 모호한 답변을 구체화하고, 실제 본인의 경험인지 검증하기 위해 깊이 파고드는 코칭 및 면접 스킬입니다.",
  },
  {
    id: 94,
    originalId: 86,
    module: "모듈 7",
    difficulty: "하",
    question:
      "목표 달성에 있어서 고성과자가 안정적으로 발휘하는 행동의 특성을 무엇이라고 하는가?",
    options: ["성격", "자질", "능력", "역량"],
    answer: 3,
    explanation:
      "역량이란 고성과자가 목표 달성에 있어서 안정적으로 발휘하는 행동의 특성을 의미합니다.",
  },
  {
    id: 95,
    originalId: 85,
    module: "모듈 8",
    difficulty: "하",
    question: "퍼스널 브랜딩(Personal Branding)의 가장 적절한 정의는 무엇인가?",
    options: [
      "자신을 타인과 철저히 똑같게 만들어 튀지 않게 하는 것",
      "비싼 옷과 명품으로 겉모습만 화려하게 포장하는 것",
      "자신의 고유한 가치와 강점을 명확히 하고, 이를 타인에게 일관되게 인식시키는 과정",
      "이력서에 거짓 경력을 그럴싸하게 지어내는 기술",
    ],
    answer: 2,
    explanation:
      "퍼스널 브랜딩은 ' 자기다움'을 바탕으로 자신만의 차별화된 가치와 전문성을 구축하여 세상에 알리는 과정입니다.",
  },
  {
    id: 96,
    originalId: 90,
    module: "모듈 8",
    difficulty: "중",
    question:
      "커리어 포트폴리오(Career Portfolio)를 작성하는 주된 목적은 무엇인가?",
    options: [
      "타인 의 이력서를 보관하기 위해",
      "자신의 이력, 성과, 역량을 시각적이고 구체적인 증거물로 정리하여 전문성을 입증하기 위해",
      "회사 기밀 문서를 몰래 유출하기 위해",
      "단순히 일기장 대용으로 쓰기 위해",
    ],
    answer: 1,
    explanation:
      "포트폴리오는 단순한 이력의 나열을 넘어, 실제 작업물과 성 과를 통해 본인의 역량을 입증하는 강력한 브랜딩 도구입니다.",
  },
  {
    id: 97,
    originalId: 93,
    module: "모듈 8",
    difficulty: "상",
    question:
      "커리어 포트폴리오에 성과를 작성할 때 코치가 요구해야 할 원칙으로 가장 적절한 것 은?",
    options: [
      '"제가 열심히 했습니다"와 같은 정성적이고 감성적인 표현만 쓴다.',
      "디자인 툴을 사용해 내용보다 배경 이미지를 화려하게 만든다.",
      "구체적인 데이터와 수치(정량적 성과)를 활용하여 객관적인 기여도를 증명한다.",
      "실패한 경험은 절대 적지 않고 성공한 척 포장한 다.",
    ],
    answer: 2,
    explanation:
      "성과는 '매출 20% 증가', '프로젝트 기간 1주일 단축' 등 구체적인 수치와 지표로 증명될 때 가장 신뢰성이 높습니 다.",
  },
  {
    id: 98,
    originalId: 95,
    module: "모듈 8",
    difficulty: "하",
    question:
      "퍼스널 브랜딩 과정에서 비언어적 요소(시각적 이미지 메이킹)의 역할에 대한 설명으로 알맞은 것은?",
    options: [
      "브랜딩과는 전혀 무관하므로 신경 쓸 필요가 없다.",
      "전달하려는 핵심 메시지(전문성 등)와 외적 이미지(복장, 태도)가 일치할 때 브랜드의 신뢰도를 높여준다.",
      "내용이 부실해도 옷만 잘 입으면 완벽한 브랜딩이 된다.",
      "모든 직종은 반드시 정장만 입어야 한다.",
    ],
    answer: 1,
    explanation:
      "시각적 요소는 언어적 메시지를 보완하며, 두 가지가 일치(Alignment)할 때 대중은 브랜드를 진정성 있게 받아들입니다.",
  },
  {
    id: 99,
    originalId: 96,
    module: "모듈 8",
    difficulty: "상",
    question:
      "평생직장의 개념이 붕괴되고 프로젝트 단위로 일하는 '긱 경제(Gig Economy)' 시대에 퍼 스널 브랜딩이 필수적인 이유는?",
    options: [
      "이름표 하나로 모든 회사에 자동 합격하기 위해서",
      "조직의 이름표가 사라져도 자신만의 이름과 평 판(전문성)으로 지속적으로 일을 창출하고 생존하기 위해서",
      "국가에서 퍼스널 브랜딩을 법으로 강제하고 있어서",
      "취미 생활을 더 즐겁게 하기 위해서",
    ],
    answer: 1,
    explanation:
      "조직이라는 울타리가 옅어지는 시대에는 '어느 회사 소속'이 아니라 '나라는 전문가가 무엇을 잘하는지' 명확히 알리는 퍼스널 브랜딩이 생존의 무기가 됩니다.",
  },
  {
    id: 100,
    originalId: 97,
    module: "모듈 9",
    difficulty: "하",
    question: "'커리어 로드맵 기본 작성 프로세스' 1단계 What에 해당하는 것은?",
    options: [
      "취업 전 략을 먼저 짠다.",
      "자신의 강·약점, 가치 등 시장에 내놓을 것과 관련해서 하고 싶은 일을 확인한다.",
      "나와 직무 목표의 SWOT 분석을 가장 먼저 한다.",
      "이력서 양식을 다운로드한다.",
    ],
    answer: 1,
    explanation:
      "로드맵 작성 1단계는 방향성의 핵심인 자기이해를 통해 '자신의 최종 목표'를 한 가운데 시각적으로 배치하는 것입니다.",
  },
  {
    id: 101,
    originalId: 98,
    module: "모듈 9",
    difficulty: "중",
    question:
      "커리어 로드맵 기본 작성 프로세스의 2단계 Where 과정에서 코치가 고객에게 요구해야 하는 활동은 무엇인가?",
    options: [
      "과거의 뼈아픈 실패 경험을 떠올리며 반성문 쓰기",
      "원하는 기업에서 원하는 일을 하고 있는 미래의 자신의 모습을 생생하게 상상해보고 그리기",
      "당장 내일 해야 할 일일 계획표 작성하기",
      "무작위로 여러 직업의 연봉 검색하기",
    ],
    answer: 1,
    explanation:
      "최종 목표를 중앙에 배치한 후(1단계), 그 목표를 이룬 긍정적이고 구체적인 시각적 이미지를 상상하여 그려보게 하는 것(2단계)입 니다.",
  },
  {
    id: 102,
    originalId: 99,
    module: "모듈 9",
    difficulty: "중",
    question:
      "커리어 로드맵 작성 3단계 HOW에서 로드맵 양식에 옮겨 적어 현재의 위치와 가능성을 객관화하는 분석 도구는?",
    options: ["PEST 분석", "재무제표 분석", "SWOT 분석", "손익분기점 분석"],
    answer: 2,
    explanation:
      "자신의 강점(S), 약점(W), 기회(O), 위협(T)을 분석한 내용을 로드맵에 옮겨 적어 전략의 기반을 마련합니다.",
  },
  {
    id: 103,
    originalId: 100,
    module: "모듈 9",
    difficulty: "상",
    question:
      "커리어 로드맵 작성 4단계이자 최종 단계인 ‘미래그리기‘에 들어갈 내용으로 가장 핵심 적인 것은?",
    options: [
      "목표 이미지를 달성하기 위한 구체적인 실행 계획(Action Plan)과 취업 전략",
      "어릴 적 꿈의 순차적 나열",
      "타인에 대한 원망과 핑계를 반박하는 과정",
      "생애의 마지막에 도달하고 싶은 이상적인 모습",
    ],
    answer: 0,
    explanation:
      "시각화된 목표와 현실의 SWOT 분석 을 바탕으로, 목표에 도달하기 위한 구체적이고 현실적인 실행 계획과 전략을 세우는 것이 4단계입니다.",
  },
  {
    id: 104,
    originalId: 101,
    module: "모듈 9",
    difficulty: "하",
    question:
      "커리어 로드맵을 글이 아닌 시각화(Visualizing)된 형태로 그리는 가장 큰 장점은 무엇인 가?",
    options: [
      "종이를 아끼고 시간을 때우기 좋아서",
      "비전과 경로를 한눈에 파악할 수 있어 뇌에 강력하게 각인되고 실행 동기를 부여하기 때 문",
      "사람은 글보다 그림을 더 빠르게 인식할 수 있기 때문",
      "그림 실력을 평가받기 위해서",
    ],
    answer: 1,
    explanation:
      "시각화는 목표에 대한 몰 입도를 높이고 긍정적 에너지를 유발하여 지속적인 실행을 돕는 강력한 코칭 도구입니다.",
  },
  {
    id: 105,
    originalId: 102,
    module: "모듈 9",
    difficulty: "중",
    question:
      "커리어 로드맵의 실행 계획(Action Plan)을 수립할 때 효과적인 목표 설정 기법은?",
    options: ["GROW 기법", "STAR 기법", "SMART 원칙", "BEI 기법"],
    answer: 2,
    explanation:
      "막연한 계획이 아닌 실행력을 담보하기 위해서는 SMART 원칙(구체적, 측정가능, 달성가능, 현실적, 기한)에 따라 구체적이고 기한이 정해진 목표를 세워야 합니다.",
  },
  {
    id: 106,
    originalId: 103,
    module: "모듈 9",
    difficulty: "상",
    question:
      "커리어 로드맵 완성 후, 코치가 예상되는 '방해물(Obstacle)'을 사전에 질문하는 이유는 무엇인가?",
    options: [
      "목표 달성이 불가능함을 깨닫게 하여 포기시키기 위해",
      "실행 과정에서 필연적으로 겪게 될 난관을 미리 예상하고 대처할 플랜 B(Plan B)를 준비하여 중도 포기를 막기 위해",
      "고객의 기분을 우울하게 만들기 위해",
      "코치가 책임을 피하기 위해",
    ],
    answer: 1,
    explanation:
      "장밋빛 미래만 그리는 것이 아니라 장애물을 선제적으로 다루면, 실제 난관에 부딪혔을 때 회복탄력성을 높일 수 있습니다.",
  },
  {
    id: 107,
    originalId: 104,
    module: "모듈 9",
    difficulty: "중",
    question:
      "전체 커리어 코칭 과정의 종결 세션에서 코치와 고객이 함께 수행해야 할 핵심 과업으 로 적절하지 않은 것은?",
    options: [
      "그동안의 목표 달성 여부 및 성장 성과를 축하하고 인정하기",
      "코칭 과정을 통해 얻은 고객의 통찰과 배움 (Insight) 정리하기",
      "앞으로의 지속적 성장을 위한 사후 관리(Follow-up) 방안 및 지지망 확인하기",
      "지금까지 다루지 않았던 완전히 새로운 장 기 목표를 꺼내어 처음부터 다시 심층 토론하기",
    ],
    answer: 3,
    explanation:
      "종결 세션에서는 새로운 주제를 열기보다는 그동안의 여정을 리뷰하 고 성과를 내재화하며 자립을 격려하는 마무리에 집중해야 합니다.",
  },
  {
    id: 108,
    originalId: 105,
    module: "모듈 9",
    difficulty: "하",
    question: "커리어 로드맵의 속성에 대한 설명으로 가장 올바른 것은?",
    options: [
      "한 번 작성하면 죽을 때까지 절대 수정해서는 안 되는 맹세이다.",
      "자신만 보도록 금고에 숨겨두어야 하는 비밀 문서이다.",
      "환경의 변화나 개인의 가치관 변화 에 따라 언제든 수정하고 보완하며 진화하는 유연한(살아있는) 지도이다.",
      "코치가 전적으로 작성해주는 이상적인 모습에 대한 보증서이다.",
    ],
    answer: 2,
    explanation:
      "프로틴 커리어 시대의 로드맵은 완벽한 고정이 아니라 유연하게 항로를 변경할 수 있는 나침반 역할을 합니다.",
  },
  {
    id: 109,
    originalId: 106,
    module: "모듈 9",
    difficulty: "중",
    question:
      "로드맵의 '단기 목표'와 '장기 목표'를 설정할 때 코치가 점검해야 할 핵심 개념은?",
    options: [
      "두 목표가 철저하게 분리되고, 단절이 가능하도록 구성하기",
      "단기 목표들이 최종 장기 목표를 향해 논리적인 인과관계로 연결되어 있 는지(정렬, Alignment) 확인",
      "장기 목표를 무조건 단기 목표보다 쉽게 설정하기",
      "타인의 목표를 그대로 복사해서 붙여넣기",
    ],
    answer: 1,
    explanation:
      "성공적인 로드맵은 오늘 딛는 한 걸음(단기 실행)이 미래의 궁극적 비전(장기 목표)과 일직선상으로 정렬되어 있어야 합니다.",
  },
  {
    id: 110,
    originalId: 107,
    module: "모듈 9",
    difficulty: "상",
    question:
      "코칭을 마치며 고객 스스로 '성찰 보고서(또는 저널)'를 작성하도록 권유하는 주된 효과 는 무엇인가?",
    options: [
      "코치의 행정 업무 부담을 덜어주기 위해",
      "배움의 과정을 스스로 시각화하고 언어화함으로써 코치 의존도를 낮추고 '자 기주도적 코칭' 능력을 내재화하기 위해",
      "고객의 맞춤법 실력을 평가하기 위해",
      "다음 회차 코칭 비용을 청구하기 위한 증빙 자료로 쓰기 위해",
    ],
    answer: 1,
    explanation:
      "성찰 기록은 코칭이 끝난 후에도 고객 스스로 자신을 코칭할 수 있는 훌륭한 메타인지 및 자기관리 훈련 도구입니 다.",
  },
  {
    id: 111,
    originalId: 108,
    module: "모듈 9",
    difficulty: "상",
    question:
      "커리어 코칭의 궁극적인 최종 목적지(Goal)를 가장 잘 표현한 문장은?",
    options: [
      "고객 이 코치가 지시한 직장에 취업하여 연봉 협상에 성공하는 것",
      "고객이 평생 코치에게 의존하여 결정 장애를 해결하는 것",
      "고객 스스로 자신의 강점과 가치를 명확히 알고, 변화하는 환경 속에서도 자신의 커리어를 주도적으로 기획/관리하는 힘(자립심)을 갖추는 것",
      "이력서와 자기소개서 라는 서류 결과물을 직무 고성과자와 일치하게 보일 수 있도록 완벽하게 얻어내는 것",
    ],
    answer: 2,
    explanation:
      "훌륭한 코칭의 완성은 코치가 더 이상 필요 없어지는 상태, 즉 고객의 완전한 '자립(Empowerment)'입니다.",
  },
  {
    id: 112,
    originalId: 109,
    module: "종합/추가",
    difficulty: "중",
    question:
      "커리어 코칭에서 이상적인 직무(Career Sweet Spot)를 찾기 위해 개인의 내적 요소(열 정, 목적, 가치 등)를 주로 어떤 현실적 요소들과 연결(정렬)하여 다루는가?",
    options: [
      "개인의 강점 및 역량, 조직의 비전(목표), 시장의 수요",
      "과거의 심리적 상처, 타인의 기대, 절대적 운명",
      "단순 학업 성적, 거주지 위치, 부모님의 직업",
      "코치의 개인적 성공 경험, 취미 생활, 정치적 성 향",
    ],
    answer: 0,
    explanation:
      "커리어 코칭에서는 고객의 내적 동기(열정, 가치)를 '개인의 강점', '조직의 목표', '시장의 수요(보상)'라는 세 가지 현실적 기둥과 연결하여 가장 빛날 수 있는 최적의 직무 경로를 기획하도록 돕습니다.",
  },
];

// 핵심 기능 로직//
function App() {
  const [page, setPage] = useState("quiz");
  const [ideas, setIdeas] = useState([]);
  const [ideaInput, setIdeaInput] = useState("");
  const [ideaViewMode, setIdeaViewMode] = useState("public");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(null);
  const [quizMode, setQuizMode] = useState("random");
  const [retryQuestions, setRetryQuestions] = useState([]);
  // 🔥 핵심: 선택된 문제를 "상태로 고정"//
  const [selectedQuiz, setSelectedQuiz] = useState([]);

  const QUESTION_TIME = 60;
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  // 닉네임 기능
  const [nickname, setNickname] = useState("");
  //시험결과 저장기
  const [savedResult, setSavedResult] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [resultNickname, setResultNickname] = useState("");
  //시험결과 닉네임별 학습 요약 계산
  const filteredResults = useMemo(() => {
    const target = resultNickname.trim();
    if (!target) return [];
    return resultList.filter((item) => item.nickname === target);
  }, [resultList, resultNickname]);

  const studySummary = useMemo(() => {
    if (filteredResults.length === 0) {
      return {
        totalQuestions: 0,
        totalSeconds: 0,
        studyDays: 0,
        averageCorrectRate: 0,
      };
    }

    const totalQuestions = filteredResults.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const totalSeconds = filteredResults.reduce(
      (sum, item) => sum + item.spentSeconds,
      0
    );
    const uniqueDays = new Set(filteredResults.map((item) => item.day)).size;
    const totalScore = filteredResults.reduce(
      (sum, item) => sum + item.score,
      0
    );
    const averageCorrectRate =
      totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      totalSeconds,
      studyDays: uniqueDays,
      averageCorrectRate,
    };
  }, [filteredResults]);

  const formatStudyTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}시간 ${m}분 ${s}초`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
  };

  // 🔥 시작할 때만 랜덤 생성//

  useEffect(() => {
    if (db) {
      const ideasQuery = query(
        collection(db, "coachingIdeas"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        ideasQuery,
        (snapshot) => {
          const nextIdeas = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              nickname: data.nickname || "익명",
              text: data.text || "",
              time: data.createdAt?.toDate
                ? data.createdAt.toDate().toLocaleString()
                : "방금 전",
            };
          });
          setIdeas(nextIdeas);
        },
        (error) => {
          console.error("공개 의견 불러오기 실패", error);
        }
      );

      return () => unsubscribe();
    }

    const savedIdeas = localStorage.getItem("coaching-quiz-ideas");
    if (savedIdeas) {
      try {
        setIdeas(JSON.parse(savedIdeas));
      } catch (error) {
        console.error("아이디어 불러오기 실패", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!db) {
      localStorage.setItem("coaching-quiz-ideas", JSON.stringify(ideas));
    }
  }, [ideas]);
  //닉네임
  <div style={{ marginTop: 16 }}>
    <input
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      placeholder="익명 닉네임 입력 (선택)"
      style={{
        width: "100%",
        maxWidth: 320,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #ccc",
        fontSize: 14,
        boxSizing: "border-box",
      }}
    />
  </div>;
  // 닉네임 로그, 시험결과 저장용
  useEffect(() => {
    if (!db) return;

    const resultQuery = query(
      collection(db, "quizResults"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      resultQuery,
      (snapshot) => {
        const nextResults = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            nickname: data.nickname || "익명",
            score: data.score || 0,
            total: data.total || 0,
            wrongCount: data.wrongCount || 0,
            correctRate: data.correctRate || 0,
            spentSeconds: data.spentSeconds || 0,
            quizMode: data.quizMode || "random",
            day: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : "",
            timeText: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleString()
              : "방금 전",
          };
        });

        setResultList(nextResults);
        // 제출 횟수 기준 참여자 수
        setTotalUsers(nextResults.length);
      },
      (error) => {
        console.error("시험 결과 불러오기 실패", error);
      }
    );

    return () => unsubscribe();
  }, []);
  //시작화면
  useEffect(() => {
    if (!started) return;

    if (quizMode === "wrong" && retryQuestions.length > 0) {
      setSelectedQuiz(retryQuestions);
      return;
    }

    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    setSelectedQuiz(shuffled.slice(0, questionCount));
  }, [started, questionCount, quizMode, retryQuestions]);

  const goToNextQuestion = () => {
    if (current < selectedQuiz.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const goToPrevQuestion = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  };

  const handleSelect = (idx) => {
    setAnswers((prev) => ({ ...prev, [current]: idx }));
  };

  const startQuiz = () => {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setStarted(true);
    setTimeLeft(QUESTION_TIME);
    setSavedResult(false);
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setQuizMode("random");
    setRetryQuestions([]);
    setSelectedQuiz([]);
    setTimeLeft(QUESTION_TIME);
    setSavedResult(false);
  };

  const retryWrongAnswers = (wrongQuestions) => {
    setRetryQuestions([...wrongQuestions]);
    setQuizMode("wrong");
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setStarted(true);
    setTimeLeft(QUESTION_TIME);
  };

  // 타이머 초기화
  useEffect(() => {
    if (!started || submitted || selectedQuiz.length === 0) return;
    setTimeLeft(QUESTION_TIME);
  }, [current, started, submitted, selectedQuiz.length]);

  // 타이머 감소
  useEffect(() => {
    if (!started || submitted || selectedQuiz.length === 0) return;

    if (timeLeft === 0) {
      if (answers[current] === undefined) {
        setAnswers((prev) => ({ ...prev, [current]: null }));
      }
      goToNextQuestion();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, started, submitted, selectedQuiz.length, current, answers]);

  // 점수 계산 (최적화)
  const score = useMemo(() => {
    return selectedQuiz.reduce((acc, q, i) => {
      return acc + (answers[i] === q.answer ? 1 : 0);
    }, 0);
  }, [selectedQuiz, answers]);

  const wrongAnswers = useMemo(() => {
    return selectedQuiz
      .map((q, i) => ({
        q,
        i,
        userAnswer: answers[i],
        isUnanswered: answers[i] === undefined || answers[i] === null,
      }))
      .filter(({ q, userAnswer }) => userAnswer !== q.answer);
  }, [selectedQuiz, answers]);

  //시험결과 저장
  const saveQuizResult = async () => {
    if (savedResult) return;

    const solvedCount = selectedQuiz.length;
    const spentSeconds = solvedCount * QUESTION_TIME - timeLeft;

    const resultData = {
      nickname: nickname.trim() || "익명",
      score,
      total: solvedCount,
      wrongCount: wrongAnswers.length,
      correctRate:
        solvedCount > 0 ? Math.round((score / solvedCount) * 100) : 0,
      spentSeconds,
      quizMode,
      createdAt: serverTimestamp(),
    };

    if (db) {
      try {
        await addDoc(collection(db, "quizResults"), resultData);
        setSavedResult(true);
      } catch (error) {
        console.error("시험 결과 저장 실패", error);
      }
    } else {
      const localResults = JSON.parse(
        localStorage.getItem("quiz-results") || "[]"
      );
      localResults.unshift({
        ...resultData,
        createdAtText: new Date().toLocaleString(),
      });
      localStorage.setItem("quiz-results", JSON.stringify(localResults));
      setSavedResult(true);
    }
  };
  //if (submitted) 화면에 들어왔을 때 한 번만 저장

  useEffect(() => {
    if (submitted && selectedQuiz.length > 0) {
      saveQuizResult();
    }
  }, [submitted]);
  //학습 기록 보기 페이지 추가
  if (page === "study") {
    return (
      <div
        style={{
          padding: 20,
          maxWidth: 760,
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>닉네임별 학습 기록</h2>

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <input
            value={resultNickname}
            onChange={(e) => setResultNickname(e.target.value)}
            placeholder="닉네임 입력"
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>

        {resultNickname.trim() === "" ? (
          <p style={{ color: "#666" }}>확인할 닉네임을 입력해 주세요.</p>
        ) : filteredResults.length === 0 ? (
          <p style={{ color: "#666" }}>해당 닉네임의 학습 기록이 없습니다.</p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  padding: 14,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>
                  총 학습 문항 수
                </div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  {studySummary.totalQuestions}문항
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>총 학습 시간</div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  {formatStudyTime(studySummary.totalSeconds)}
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>
                  학습한 날짜 수
                </div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  {studySummary.studyDays}일
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>평균 정답률</div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  {studySummary.averageCorrectRate}%
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                    {item.timeText}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                    점수 {item.score}/{item.total} · 정답률 {item.correctRate}%
                    · 학습 시간 {formatStudyTime(item.spentSeconds)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setPage("quiz")}
          style={{
            marginTop: 24,
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ccc",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          ← 돌아가기
        </button>
      </div>
    );
  }

  //저작권
  if (page === "copyright") {
    return (
      <div
        style={{
          padding: 20,
          maxWidth: 760,
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.7,
        }}
      >
        <h2>저작권 및 이용 안내</h2>

        {!db && (
          <div
            style={{
              marginTop: 12,
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#fff7ed",
              border: "1px solid #fdba74",
              color: "#9a3412",
              fontSize: 14,
            }}
          >
            지금은 이 기기에서만 보이는 임시 저장 모드입니다. 여러 사람이 함께
            보는 공개 의견 게시판으로 사용하려면 상단 firebaseConfig 값을 입력해
            주세요.
          </div>
        )}

        <div style={{ whiteSpace: "pre-line", color: "#333" }}>
          {`© 2026 퐁퐁샘솟아 · For educational use only

제작 의도:
- 틈날 때마다 휴대폰으로 코칭 이론을 쉽게 학습하도록 만들었습니다.
- 저처럼 시험 불안이 있는 분도 실제 시험과 비슷하게 연습할 수 있습니다
- 이 앱은 제가 보는 필기 시험 전에 제작했습니다.
- ChatGPT와 Gemini를 활용해 필기 문항을 만들고 일부 어색한 표현만 수정했습니다.
- CIT 코칭연구소와 한국코치협회 이론 설명을 바탕으로 출제했습니다.
- 따라서 한국코치협회의 실제 필기시험 문항과 완전히 일치하지 않습니다.
- CIT 코칭연구소에서 함께 공부하신 분들에게 도움이 되길 희망합니다.
- 함께 공부하는 목적의 친구 간 공유는 가능하지만, 상업적 이용은 금지합니다.

2026.03.29. 퐁퐁샘솟아

오류나 수정 제안이 있으면 아래의 "아이디어 공유"에 남겨주세요.`}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 28,
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>Share Ideas</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setIdeaViewMode("public")}>공개 보기</button>
            <button onClick={() => setIdeaViewMode("write")}>
              아이디어 공유
            </button>
          </div>
        </div>

        {ideaViewMode === "write" && (
          <>
            <textarea
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              placeholder="익명으로 보완하면 좋을 아이디어를 공유해주세요"
              style={{
                width: "100%",
                height: 96,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={async () => {
                const trimmed = ideaInput.trim();
                if (!trimmed) return;

                if (db) {
                  try {
                    await addDoc(collection(db, "coachingIdeas"), {
                      nickname: nickname.trim() || "익명",
                      text: trimmed,
                      createdAt: serverTimestamp(),
                    });
                  } catch (error) {
                    console.error("의견 저장 실패", error);
                    alert(
                      "의견 저장에 실패했습니다. Firebase 설정을 확인해 주세요."
                    );
                    return;
                  }
                } else {
                  const now = new Date().toLocaleString();
                  setIdeas([
                    {
                      id:
                        typeof crypto !== "undefined" && crypto.randomUUID
                          ? crypto.randomUUID()
                          : Date.now().toString(),
                      nickname: nickname.trim() || "익명",
                      text: trimmed,
                      time: now,
                    },
                    ...ideas,
                  ]);
                }

                setIdeaInput("");
                setIdeaViewMode("public");
              }}
              style={{
                marginTop: 10,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              제출
            </button>
          </>
        )}

        <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
          {ideas.length === 0 ? (
            <div
              style={{
                padding: 12,
                border: "1px dashed #ccc",
                borderRadius: 8,
                color: "#666",
              }}
            >
              아직 등록된 의견이 없습니다.
            </div>
          ) : (
            ideas.map((idea, idx) => (
              <div
                key={idea.id || idx}
                style={{
                  padding: 12,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: "bold", marginBottom: 4 }}
                >
                  {idea.nickname || "익명"}
                </div>
                <div style={{ fontSize: 14 }}>{idea.text}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  {idea.time}
                </div>
              </div>
            ))
          )}
        </div>

        <button onClick={() => setPage("quiz")} style={{ marginTop: 24 }}>
          ← 돌아가기
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div
        style={{
          padding: 20,
          maxWidth: 760,
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ marginBottom: 12 }}>커리어코치 1급 자격과정 모의퀴즈</h1>
        <p style={{ lineHeight: 1.6, color: "#444" }}>
          자격증 시험 불안을 감소시켜 드리기 위해 만들었습니다. 퀴즈를 통해
          여러분의 학습수준을 검토할 수 있습니다. 풀고 싶은 문항 수를 선택한 후
          시작하세요.[커리어코치협회]
        </p>
        <div style={{ marginTop: 16, marginBottom: 12 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            익명 닉네임
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요 (예: 봄샘)"
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
            입력하지 않으면 자동으로 '익명'으로 저장됩니다.
          </div>
        </div>
        {quizMode === "wrong" && retryQuestions.length > 0 && (
          <p style={{ lineHeight: 1.6, color: "#1d4ed8", fontWeight: "bold" }}>
            오답 문항 다시 풀기 모드입니다.
          </p>
        )}
        <div
          style={{
            marginTop: 20,
            fontSize: 15,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {questionCount
            ? `${questionCount}문항이 선택되었습니다.`
            : "문항 수를 먼저 선택해 주세요."}
        </div>
        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}
        >
          {[10, 20, 30, 40, 50, 60].map((num) => {
            const isSelected = questionCount === num;

            return (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: isSelected ? "2px solid #ec4899" : "1px solid #ccc",
                  backgroundColor: isSelected ? "#ec4899" : "#fff",
                  color: isSelected ? "white" : "#333",
                  fontWeight: isSelected ? "bold" : "normal",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {num}문항
              </button>
            );
          })}
        </div>

        <button
          onClick={startQuiz}
          disabled={!questionCount}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#db2777")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ec4899")}
          style={{
            padding: "18px 28px", // 🔥 크기 증가
            fontSize: 18, // 🔥 글씨 크게
            fontWeight: "bold",
            borderRadius: 12,
            border: "none",
            backgroundColor: questionCount ? "#ec4899" : "#f9a8d4", // 🔥 핑크 (Tailwind pink-500)
            color: "white",
            cursor: questionCount ? "pointer" : "not-allowed",
            marginTop: 50,
            width: "100%",
            maxWidth: 150,
            opacity: questionCount ? 1 : 0.7,
          }}
        >
          시작하기
        </button>
        <button
          onClick={() => setPage("study")}
          style={{
            marginTop: 12,
            display: "block",
            fontSize: 12,
            color: "#666",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          닉네임별 학습 기록 보기
        </button>

        <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
          지금까지 {totalUsers}명이 이 퀴즈에 참여했습니다.
        </div>
        <button
          onClick={() => setPage("copyright")}
          style={{
            marginTop: 60,
            display: "block",
            fontSize: 12,
            color: "#666",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Copyright & 이용 안내
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: 20,
          maxWidth: 760,
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>제출이 완료되었습니다.</h2>
        <div
          style={{
            marginTop: 16,
            marginBottom: 20,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 12,
            backgroundColor: "#f9fafb",
          }}
        >
          <div style={{ fontSize: 14, color: "#666", marginBottom: 6 }}>
            점수
          </div>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>
            {score} / {selectedQuiz.length}
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          결과 저장 닉네임: {nickname.trim() || "익명"}
        </div>
        {savedResult && (
          <div style={{ marginTop: 10, color: "#2563eb", fontSize: 14 }}>
            시험 결과가 저장되었습니다.
          </div>
        )}
        <div
          style={{
            marginBottom: 20,
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            backgroundColor: "#fcfcfd",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0 }}>오답 노트</h3>
            <div style={{ fontSize: 14, color: "#666" }}>
              오답 {wrongAnswers.length}개 · 정답{" "}
              {selectedQuiz.length - wrongAnswers.length}개
            </div>
          </div>

          {wrongAnswers.length === 0 ? (
            <p style={{ margin: 0, color: "#2563eb", fontWeight: "bold" }}>
              모든 문항을 맞혔습니다! KAC/KPC 코치 인증이 가까워집니다.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {wrongAnswers.map(({ q, i, userAnswer, isUnanswered }) => (
                <div
                  key={q.id}
                  style={{
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {i + 1}. {q.question}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gap: 4,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    <div>
                      <strong>내 답</strong> ·{" "}
                      {isUnanswered ? "선택 안 함" : q.options[userAnswer]}
                    </div>
                    <div>
                      <strong>정답</strong> · {q.options[q.answer]}
                    </div>
                    <div>
                      <strong>해설</strong> · {q.explanation || "해설 준비 중"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wrongAnswers.length > 0 && (
          <button
            onClick={() => retryWrongAnswers(wrongAnswers.map(({ q }) => q))}
          >
            오답만 다시 풀기
          </button>
        )}

        <button onClick={restartQuiz} style={{ marginLeft: 8 }}>
          다시 시작
        </button>
      </div>
    );
  }

  const q = selectedQuiz[current];
  const selectedAnswer = answers[current];

  if (!q) return null;

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 760,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: 12, color: "#666" }}>
        {current + 1} / {selectedQuiz.length}문항
      </div>

      {quizMode === "wrong" && (
        <div style={{ marginBottom: 8, color: "#1d4ed8", fontWeight: "bold" }}>
          오답 다시 풀기 모드
        </div>
      )}

      <div
        style={{
          marginBottom: 12,
          color: timeLeft <= 10 ? "#dc2626" : "#666",
          fontWeight: "bold",
        }}
      >
        남은 시간: {timeLeft}초
      </div>

      <h2 style={{ marginBottom: 20 }}>
        {current + 1}. {q.question}
      </h2>

      {q.options.map((opt, idx) => {
        const isSelected = selectedAnswer === idx;
        return (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "14px 16px",
              textAlign: "left",
              borderRadius: 10,
              border: isSelected ? "2px solid #2563eb" : "1px solid #ccc",
              backgroundColor: isSelected ? "#dbeafe" : "#fff",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: isSelected ? "bold" : "normal",
            }}
          >
            {isSelected ? "✔ " : ""}
            {opt}
          </button>
        );
      })}

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 14, color: "#666" }}>
          {selectedAnswer !== undefined && selectedAnswer !== null
            ? "선택한 답이 저장되었습니다."
            : "답을 선택해 주세요."}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={goToPrevQuestion} disabled={current === 0}>
            이전
          </button>

          {current < selectedQuiz.length - 1 ? (
            <button onClick={goToNextQuestion}>다음</button>
          ) : (
            <button onClick={() => setSubmitted(true)}>제출</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
