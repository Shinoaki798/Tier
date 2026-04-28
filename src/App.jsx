import { useState } from 'react'
import Plot from 'react-plotly.js'
import './App.css'

const INITIAL_POINTS = []

function App() {
  const [points, setPoints] = useState(INITIAL_POINTS)
  const [name, setName] = useState('')
  const [appearance, setAppearance] = useState(5)   // 外貌指数 0–10
  const [crazy, setCrazy] = useState(7)              // 作妖指数 4–10
  const [materialistic, setMaterialistic] = useState(5) // 拜金指数 0–10

  const handleSubmit = (e) => {
    e.preventDefault()
    const label = name.trim() || `点 ${points.length + 1}`
    setPoints((prev) => [
      ...prev,
      { name: label, x: Number(appearance), y: Number(crazy), z: Number(materialistic) },
    ])
    setName('')
  }

  const trace = {
    type: 'scatter3d',
    mode: 'markers+text',
    x: points.map((p) => p.x),
    y: points.map((p) => p.y),
    z: points.map((p) => p.z),
    text: points.map((p) => p.name),
    hovertext: points.map((p) => p.name),
    hoverinfo: 'text',
    textposition: 'top center',
    marker: {
      size: 8,
      color: points.map((_, i) => i),
      colorscale: 'Viridis',
      opacity: 0.9,
    },
  }

  const layout = {
    autosize: true,
    scene: {
      xaxis: { title: '外貌指数', range: [0, 10] },
      yaxis: { title: '作妖指数', range: [4, 10] },
      zaxis: { title: '拜金指数', range: [0, 10] },
    },
    margin: { l: 0, r: 0, t: 40, b: 0 },
    title: { text: '3D 魅力矩阵', font: { size: 18 } },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
  }

  return (
    <div className="app-container">
      <div className="plot-panel">
        <Plot
          data={[trace]}
          layout={layout}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true }}
        />
      </div>

      <div className="form-panel">
        <h1 className="form-title">添加数据点</h1>
        <form onSubmit={handleSubmit} className="point-form">
          <label className="field">
            <span className="field-label">姓名</span>
            <input
              type="text"
              className="text-input"
              placeholder="输入名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">外貌指数：{appearance}</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              className="slider"
            />
            <span className="range-hint">0 — 10</span>
          </label>

          <label className="field">
            <span className="field-label">作妖指数：{crazy}</span>
            <input
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={crazy}
              onChange={(e) => setCrazy(e.target.value)}
              className="slider"
            />
            <span className="range-hint">4 — 10</span>
          </label>

          <label className="field">
            <span className="field-label">拜金指数：{materialistic}</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={materialistic}
              onChange={(e) => setMaterialistic(e.target.value)}
              className="slider"
            />
            <span className="range-hint">0 — 10</span>
          </label>

          <button type="submit" className="submit-btn">
            添加到图表
          </button>
        </form>

        {points.length > 0 && (
          <div className="points-list">
            <h2 className="list-title">已添加的点 ({points.length})</h2>
            <ul>
              {points.map((p, i) => (
                <li key={i} className="point-item">
                  <strong>{p.name}</strong>
                  <span>外貌 {p.x} · 作妖 {p.y} · 拜金 {p.z}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
