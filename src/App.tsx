import { useState, useMemo } from 'react';
import './index.css';
import sevvalImage from './assets/sevval.jpeg';

interface Subject {
  id: string;
  name: string;
  maxQuestions: number;
  correct: string;
  incorrect: string;
}

const initialTyt: Subject[] = [
  { id: 'tyt_trk', name: 'Türkçe', maxQuestions: 40, correct: '', incorrect: '' },
  { id: 'tyt_sos', name: 'Sosyal Bilimler', maxQuestions: 20, correct: '', incorrect: '' },
  { id: 'tyt_mat', name: 'Temel Matematik', maxQuestions: 40, correct: '', incorrect: '' },
  { id: 'tyt_fen', name: 'Fen Bilimleri', maxQuestions: 20, correct: '', incorrect: '' },
];

const initialAyt: Subject[] = [
  { id: 'ayt_mat', name: 'Matematik', maxQuestions: 40, correct: '', incorrect: '' },
  { id: 'ayt_fiz', name: 'Fizik', maxQuestions: 14, correct: '', incorrect: '' },
  { id: 'ayt_kim', name: 'Kimya', maxQuestions: 13, correct: '', incorrect: '' },
  { id: 'ayt_biy', name: 'Biyoloji', maxQuestions: 13, correct: '', incorrect: '' },
  { id: 'ayt_edb', name: 'Edebiyat', maxQuestions: 24, correct: '', incorrect: '' },
  { id: 'ayt_tar1', name: 'Tarih-1', maxQuestions: 10, correct: '', incorrect: '' },
  { id: 'ayt_cog1', name: 'Coğrafya-1', maxQuestions: 6, correct: '', incorrect: '' },
];

const calculateNet = (correct: string, incorrect: string) => {
  const c = parseInt(correct) || 0;
  const i = parseInt(incorrect) || 0;
  return c - (i / 4);
};

function App() {
  const [tytSubjects, setTytSubjects] = useState<Subject[]>(initialTyt);
  const [aytSubjects, setAytSubjects] = useState<Subject[]>(initialAyt);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (
    type: 'TYT' | 'AYT',
    id: string,
    field: 'correct' | 'incorrect',
    value: string
  ) => {
    const updater = type === 'TYT' ? setTytSubjects : setAytSubjects;
    const subjects = type === 'TYT' ? tytSubjects : aytSubjects;
    
    setShowResult(false);

    updater(
      subjects.map((sub) => {
        if (sub.id !== id) return sub;
        
        let numValue = parseInt(value);
        if (value === '') {
           return { ...sub, [field]: '' };
        }
        
        if (isNaN(numValue) || numValue < 0) numValue = 0;
        
        // Ensure correct + incorrect doesn't exceed maxQuestions
        const otherField = field === 'correct' ? 'incorrect' : 'correct';
        const otherValue = parseInt(sub[otherField]) || 0;
        
        if (numValue + otherValue > sub.maxQuestions) {
          numValue = sub.maxQuestions - otherValue;
        }

        return { ...sub, [field]: numValue.toString() };
      })
    );
  };

  const tytTotalNet = useMemo(() => {
    return tytSubjects.reduce((total, sub) => total + calculateNet(sub.correct, sub.incorrect), 0);
  }, [tytSubjects]);

  const aytSAYNet = useMemo(() => {
    const sayIds = ['ayt_mat', 'ayt_fiz', 'ayt_kim', 'ayt_biy'];
    return aytSubjects
      .filter((sub) => sayIds.includes(sub.id))
      .reduce((total, sub) => total + calculateNet(sub.correct, sub.incorrect), 0);
  }, [aytSubjects]);

  const aytEANet = useMemo(() => {
    const eaIds = ['ayt_mat', 'ayt_edb', 'ayt_tar1', 'ayt_cog1'];
    return aytSubjects
      .filter((sub) => eaIds.includes(sub.id))
      .reduce((total, sub) => total + calculateNet(sub.correct, sub.incorrect), 0);
  }, [aytSubjects]);

  const aytTotalNet = Math.max(aytSAYNet, aytEANet); 

  const isWinner = tytTotalNet > 90 && aytTotalNet > 65;

  const renderSubjectTable = (title: string, subjects: Subject[], type: 'TYT' | 'AYT') => (
    <div className="glass" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <h2 className="section-title">{title}</h2>
      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Ders</th>
              <th>Soru Sayısı</th>
              <th>Doğru</th>
              <th>Yanlış</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => {
              const net = calculateNet(sub.correct, sub.incorrect);
              return (
                <tr key={sub.id}>
                  <td>{sub.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{sub.maxQuestions}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max={sub.maxQuestions}
                      value={sub.correct}
                      onChange={(e) => handleInputChange(type, sub.id, 'correct', e.target.value)}
                      className="input-number"
                      style={{ borderColor: sub.correct ? 'rgba(59, 130, 246, 0.4)' : '' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max={sub.maxQuestions}
                      value={sub.incorrect}
                      onChange={(e) => handleInputChange(type, sub.id, 'incorrect', e.target.value)}
                      className="input-number"
                      style={{ borderColor: sub.incorrect ? 'rgba(239, 68, 68, 0.4)' : '' }}
                    />
                  </td>
                  <td className="net-score">
                    {net.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <header className="header text-center">
        <h1 className="title gradient-text">YKS Net Hesaplama</h1>
        <p className="subtitle">
          OGM Materyal sistemine uygun olarak hazırlanmış TYT ve AYT net hesaplama aracı. Doğru ve yanlış sayılarınızı girerek netlerinizi hesaplayın.
        </p>
      </header>

      <main className="container main-grid">
        <div className="column">
          {renderSubjectTable('TYT (Temel Yeterlilik Testi)', tytSubjects, 'TYT')}
          
          <div className="glass total-bar">
            <span className="total-label">TYT Toplam Net:</span>
            <span className="total-value">{tytTotalNet.toFixed(2)}</span>
          </div>
        </div>

        <div className="column">
          {renderSubjectTable('AYT (Alan Yeterlilik Testi)', aytSubjects, 'AYT')}
          
          <div className="ayt-totals-grid">
            <div className="glass ayt-total-card say">
              <span className="ayt-total-label">AYT Sayısal Net</span>
              <span className="ayt-total-value">{aytSAYNet.toFixed(2)}</span>
            </div>
            <div className="glass ayt-total-card ea">
              <span className="ayt-total-label">AYT E.Ağırlık Net</span>
              <span className="ayt-total-value">{aytEANet.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <button className="btn-calculate" onClick={() => setShowResult(true)}>
        Sonucu Hesapla
      </button>

      {showResult && isWinner && (
        <div className="overlay" onClick={() => setShowResult(false)}>
          <div className="glass overlay-card" onClick={(e) => e.stopPropagation()}>
            <img 
              src={sevvalImage} 
              alt="Başarı Görseli" 
              className="tooth-image"
            />
            <h2 className="winner-text" style={{ fontSize: '2.5rem', lineHeight: '1.2', textTransform: 'none' }}>
              Harika Gidiyorsun Şevval!
            </h2>
            <p className="winner-desc" style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify', marginTop: '1rem' }}>
              Şu anki netlerinle hedeflerine çok yakınsın! Bu zorlu YKS maratonunda gösterdiğin azim ve kararlılık gerçekten takdire şayan. Unutma ki başarı tesadüf değildir; senin gibi disiplinli ve ne istediğini bilerek çalışanların hakkıdır. Şimdi rehavete kapılma vakti değil, tam aksine bu ivmeyi koruyarak denemelerde daha da hızlanma vakti. Aynı kararlılıkla, pes etmeden bu yolda yürümeye devam et. Hayalindeki o üniversitenin kapısından içeri adım atana kadar durmak yok. Sen bu işi kesinlikle başaracaksın!
            </p>
            <button className="btn-close" onClick={() => setShowResult(false)}>Kapat</button>
          </div>
        </div>
      )}

      {showResult && !isWinner && (
        <div className="overlay" onClick={() => setShowResult(false)}>
          <div className="glass overlay-card" style={{ animation: 'none', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="loser-text" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
              Asla Pes Etme Şevval!
            </h2>
            <p className="winner-desc" style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify', marginTop: '1rem' }}>
              Şu anki netlerin (TYT: {tytTotalNet.toFixed(2)}, AYT: {aytTotalNet.toFixed(2)}) hedeflerinin biraz uzağında olabilir ama bu sadece anlık bir durum. Her yanlış yaptığın soru, aslında sınavdan önce sana doğruyu öğreten gizli birer fırsattır. Zorlanmadan ve yorulmadan büyük zirvelere ulaşılamaz. Şimdi yapman gereken tek şey nerede hata yaptığını analiz etmek ve yarın dünden daha çok çalışmak. Kendine inanmaktan asla vazgeçme; çünkü sen o masanın başında sabırla ter döktüğünde başaramayacağın hiçbir şey yok. Derin bir nefes al ve hayallerin için savaşmaya devam et!
            </p>
            <button className="btn-close" onClick={() => setShowResult(false)}>Kapat</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
