/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, LevelConfig } from '../types/game';

export const CURRICULUM_INFO = {
  subject: 'Bahasa Indonesia',
  gradeLevel: 'SD Kelas 6',
  phase: 'Fase C',
  topics: [
    'Mengenal Cerita Rakyat dan jenis-jenisnya (Mite, Legenda, Fabel, Sage, Parabel)',
    'Membaca dan memahami tentang teks sastra bergambar',
    'Memahami nilai-nilai luhur dan pesan moral dalam cerita rakyat',
    'Memahami serta membedakan makna konotatif (kiasan) dan denotatif (sebenarnya)'
  ]
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    title: 'LEVEL 1',
    subtitle: 'Dunia Eksplorasi',
    theme: 'GRASSLAND',
    description: 'Pemahaman konsep dasar jenis-jenis cerita rakyat dan teks sastra bergambar.',
    worldLength: 90,
    targetQuestions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
    bgColor: '#7ec0ee',
    fogColor: '#bde0fe'
  },
  {
    id: 2,
    title: 'LEVEL 2',
    subtitle: 'Jembatan Tantangan',
    theme: 'BRIDGE',
    description: 'Penerapan konsep, membaca teks sastra bergambar, dan menggali nilai moral cerita rakyat.',
    worldLength: 95,
    targetQuestions: ['Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
    bgColor: '#f6d365',
    fogColor: '#fda085'
  },
  {
    id: 3,
    title: 'LEVEL 3',
    subtitle: 'Kastel Juara',
    theme: 'CASTLE',
    description: 'Penalaran dan evaluasi mendalam: Membedakan makna konotatif vs denotatif serta hikmah sastra.',
    worldLength: 100,
    targetQuestions: ['Q11', 'Q12', 'Q13', 'Q14', 'Q15'],
    bgColor: '#3a1c71',
    fogColor: '#d76d77'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // --- LEVEL 1: DUNIA EKSPLORASI (Pemahaman Konsep Dasar) ---
  {
    id: 'Q1',
    level: 1,
    topic: 'Jenis Cerita Rakyat (Fabel)',
    question: 'Cerita rakyat yang tokoh-tokoh utamanya diperankan oleh hewan yang dapat berbicara dan berperilaku layaknya manusia disebut...',
    options: ['Legenda', 'Fabel', 'Mite (Mitos)', 'Sage'],
    correctAnswer: 1,
    explanation: 'Fabel adalah cerita rekaan yang mempergunakan tokoh hewan yang bertingkah laku seperti manusia untuk menyampaikan pesan moral.',
    hint: 'Ingat kisah Kancil dan Buaya, tokohnya adalah hewan yang bisa berbicara.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q2',
    level: 1,
    topic: 'Jenis Cerita Rakyat (Legenda)',
    question: 'Kisah terjadinya Danau Toba atau Tangkuban Perahu dikelompokkan ke dalam jenis cerita rakyat...',
    options: ['Sage', 'Mite', 'Legenda', 'Parabel'],
    correctAnswer: 2,
    explanation: 'Legenda adalah cerita rakyat yang menceritakan riwayat terjadinya atau asal-usul suatu tempat, benda alam, atau fenomena wilayah.',
    hint: 'Cerita yang mengisahkan asal mula terbentuknya suatu tempat atau bentang alam.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q3',
    level: 1,
    topic: 'Jenis Cerita Rakyat (Mite / Mitos)',
    question: 'Cerita rakyat yang berhubungan dengan kepercayaan masyarakat terhadap dewa-dewi, roh gaib, atau hal mistis suci adalah...',
    options: ['Mite (Mitos)', 'Fabel', 'Dongeng Jenaka', 'Sage'],
    correctAnswer: 0,
    explanation: 'Mite (mitos) adalah cerita prosa rakyat yang menceritakan kisah supranatural, tokoh dewa-dewi atau makhluk gaib sakral.',
    hint: 'Mite berhubungan dengan kisah gaib atau dewa-dewi suci.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q4',
    level: 1,
    topic: 'Jenis Cerita Rakyat (Sage)',
    question: 'Cerita rakyat yang mengandung unsur sejarah serta menonjolkan kepahlawanan dan kesaktian tokoh kesatria disebut...',
    options: ['Legenda', 'Mite', 'Sage', 'Parabel'],
    correctAnswer: 2,
    explanation: 'Sage adalah cerita lama yang berakar dari peristiwa sejarah kepahlawanan, kesaktian, dan keberanian tokoh pejuang masa lalu.',
    hint: 'Cerita tentang kesatria yang memiliki keberanian atau kepahlawanan luar biasa.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q5',
    level: 1,
    topic: 'Teks Sastra Bergambar',
    question: 'Dalam sebuah teks sastra bergambar, fungsi utama ilustrasi atau gambar yang menyertai cerita adalah...',
    options: [
      'Menghabiskan ruang halaman buku',
      'Memperjelas peristiwa dan menghidupkan suasana cerita',
      'Menggantikan seluruh teks cerita tanpa tulisan',
      'Menyulitkan pembaca dalam memahami alur'
    ],
    correctAnswer: 1,
    explanation: 'Ilustrasi gambar dalam teks sastra berfungsi memperjelas suasana, karakter, dan alur cerita sehingga pembaca dapat berimajinasi lebih nyata.',
    hint: 'Gambar membantu kita melihat wujud tokoh dan suasana yang sedang terjadi.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },

  // --- LEVEL 2: JEMBATAN TANTANGAN (Penerapan Konsep & Nilai Cerita) ---
  {
    id: 'Q6',
    level: 2,
    topic: 'Analisis Teks Sastra Bergambar',
    question: 'Jika pada ilustrasi gambar tampak tokoh berwajah murung dengan air mata menetes di bawah pohon rindang, informasi yang tersirat adalah...',
    options: [
      'Tokoh sedang merasa senang gembira',
      'Tokoh sedang mengalami kesedihan atau duka',
      'Tokoh sedang tertidur pulas tanpa beban',
      'Tokoh sedang marah besar kepada temannya'
    ],
    correctAnswer: 1,
    explanation: 'Bahasa visual berupa ekspresi wajah murung dan air mata menetes menyiratkan suasana hati yang sedih, haru, atau berduka.',
    hint: 'Air mata dan raut wajah murung melambangkan perasaan sedih.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q7',
    level: 2,
    topic: 'Nilai Cerita Rakyat (Malin Kundang)',
    question: 'Dari cerita rakyat Malin Kundang yang dikutuk menjadi batu, nilai moral utama yang harus kita terapkan dalam kehidupan sehari-hari adalah...',
    options: [
      'Mencari harta sebanyak-banyaknya di perantauan',
      'Bakti dan menghormati orang tua, tidak durhaka',
      'Menolak pulang ke kampung halaman',
      'Membanggakan kapal mewah kepada penduduk'
    ],
    correctAnswer: 1,
    explanation: 'Kisah Malin Kundang mengajarkan nilai moral pentingnya berbakti dan menghormati orang tua yang telah merawat kita, serta bahaya sikap sombong dan durhaka.',
    hint: 'Renungkan kesalahan fatal yang dilakukan Malin terhadap ibu kandungnya.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q8',
    level: 2,
    topic: 'Nilai Kejujuran dan Tanggung Jawab',
    question: 'Kisah "Bawang Merah dan Bawang Putih" memberikan pelajaran bahwa perbuatan jahat dan serakah akan menghasilkan kehancuran, sedangkan kebaikan dan kejujuran akan...',
    options: [
      'Mendapatkan kemalangan bertubi-tubi',
      'Memperoleh kebahagiaan dan keadilan pada akhirnya',
      'Selalu dicela oleh semua orang desa',
      'Hilang begitu saja tanpa arti'
    ],
    correctAnswer: 1,
    explanation: 'Kebaikan budi, ketulusan, dan kejujuran Bawang Putih mengantarkannya pada keberkahan dan kebahagiaan, mencerminkan nilai moral hukum sebab-akibat.',
    hint: 'Bawang Putih yang tulus dan jujur akhirnya mendapatkan kebaikan.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q9',
    level: 2,
    topic: 'Memahami Tokoh dalam Teks',
    question: 'Tokoh dalam cerita yang selalu memicu pertentangan, memiliki sifat jahat, dan menentang kebaikan tokoh utama disebut tokoh...',
    options: ['Protagonis', 'Antagonis', 'Tritagonis', 'Figuran'],
    correctAnswer: 1,
    explanation: 'Tokoh antagonis adalah tokoh yang berwatak jahat atau bertentangan dengan tokoh protagonis (tokoh utama yang baik).',
    hint: 'Lawan dari protagonis yang sering berbuat jahat.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q10',
    level: 2,
    topic: 'Amanat dalam Cerita Rakyat',
    question: 'Pesan kebaikan atau nasihat moral yang ingin disampaikan pengarang kepada para pembaca melalui alur cerita disebut...',
    options: ['Alur / Plot', 'Latar waktu', 'Amanat', 'Sudut pandang'],
    correctAnswer: 2,
    explanation: 'Amanat adalah pesan moral atau nasihat luhur yang hendak disampaikan penulis kepada pembaca agar menjadi teladan hidup.',
    hint: 'Unsur cerita yang berisi nasihat atau ajaran moral.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },

  // --- LEVEL 3: KASTEL JUARA (Penalaran Makna Konotatif & Denotatif) ---
  {
    id: 'Q11',
    level: 3,
    topic: 'Konsep Makna Denotatif',
    question: 'Kalimat berikut yang menggunakan kata bermakna DENOTATIF (makna sebenarnya / lugas) adalah...',
    options: [
      'Paman memanjat pohon kelapa menggunakan tangga bambu.',
      'Rudi menjadi buah bibir di sekolah karena prestasinya.',
      'Sita berlapang dada menerima kekalahan dalam lomba.',
      'Jangan menjadi orang yang panjang tangan!'
    ],
    correctAnswer: 0,
    explanation: 'Makna denotatif adalah makna kata yang sebenarnya sesuai kamus. "Paman memanjat pohon kelapa" berarti secara fisik paman benar-benar naik pohon kelapa.',
    hint: 'Cari kalimat yang maknanya nyata dan harfiah, bukan perumpamaan kiasan.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q12',
    level: 3,
    topic: 'Konsep Makna Konotatif',
    question: 'Perhatikan kalimat: "Meskipun sudah sukses menjadi pengusaha besar, Pak Danu tetap rendah hati kepada tetangganya." Makna konotatif dari ungkapan "rendah hati" adalah...',
    options: [
      'Tinggi badannya tidak menjulang',
      'Kondisi jantungnya berada di bagian bawah',
      'Tidak sombong dan ramah kepada sesama',
      'Merasa rendah diri dan takut bergaul'
    ],
    correctAnswer: 2,
    explanation: '"Rendah hati" memiliki makna konotatif (kiasan) yaitu sifat terpuji tidak sombong, santun, dan menghargai orang lain.',
    hint: 'Sikap orang yang tidak menyombongkan kehebatannya.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q13',
    level: 3,
    topic: 'Membedakan Konotatif dan Denotatif',
    question: 'Manakah di antara kalimat berikut yang memuat kata bermakna KONOTATIF (makna kiasan)?',
    options: [
      'Ibu menyeduh secangkir kopi hitam yang masih hangat.',
      'Ayah membawakan buah tangan berupa bakpia seusai dinas luar kota.',
      'Adik memakai kemeja berwarna putih bersih di hari Senin.',
      'Kucing itu tidur nyenyak di atas karpet ruang tengah.'
    ],
    correctAnswer: 1,
    explanation: '"Buah tangan" bermakna konotatif yaitu oleh-oleh, bukan buah yang tumbuh pada tangan fisik manusia.',
    hint: 'Buah tangan memiliki arti khusus yang bukan berarti buah di tangan.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q14',
    level: 3,
    topic: 'Analisis Kalimat Konotatif dalam Cerita',
    question: '"Ketika terjadi musyawarah desa, kepala desa meminta seluruh warga berkepala dingin dalam menyelesaikan sengketa." Ungkapan "berkepala dingin" bermakna...',
    options: [
      'Membasahi kepala dengan es batu agar dingin',
      'Bersikap tenang, sabar, dan tidak dikuasai amarah',
      'Kepala terasa pusing karena hawa dingin',
      'Memakai topi tebal penahan angin'
    ],
    correctAnswer: 1,
    explanation: '"Berkepala dingin" adalah kiasan untuk sikap tenang, sabar, dan berpikir jernih tanpa emosi kemarahan.',
    hint: 'Sikap tenang dan tidak emosional saat memecahkan masalah.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  },
  {
    id: 'Q15',
    level: 3,
    topic: 'Penerapan Sastra & Kebijaksanaan',
    question: 'Dalam sebuah cerita fabel, burung merpati dijuluki sebagai "tulang punggung keluarga". Kata "tulang punggung" secara konotatif memiliki arti...',
    options: [
      'Rangka tulang belakang pada tubuh merpati',
      'Orang atau pihak yang menjadi penopang utama penghidupan keluarga',
      'Penyakit pegal linu di daerah punggung',
      'Duri tajam yang menusuk sayap burung'
    ],
    correctAnswer: 1,
    explanation: '"Tulang punggung" secara konotatif bermakna tumpuan utama, pencari nafkah, atau penopang hidup keluarga.',
    hint: 'Makna kiasan untuk orang yang menanggung nafkah seluruh keluarga.',
    solved: false,
    attempts: 0,
    firstAttemptCorrect: null
  }
];
