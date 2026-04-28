import { useState } from 'react'
import PlotlyComponent from 'react-plotly.js'
import { useMemo } from 'react'

import './App.css'

const Plot = PlotlyComponent.default || PlotlyComponent
const INITIAL_POINTS = []

function App() {
  const [points, setPoints] = useState(INITIAL_POINTS)
  const [name, setName] = useState('')
  const [appearance, setAppearance] = useState(5)   // 外貌指数 0–10
  const [crazy, setCrazy] = useState(7)              // 作妖指数 4–10
  const [materialistic, setMaterialistic] = useState(5) // 拜金指数 0–10
  const [showDiagonal, setShowDiagonal] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const label = name.trim()
    if (!label) {
      alert('请在添加之前输入姓名！')
      return
    }
    setPoints((prev) => [
      ...prev,
      { name: label, x: Number(appearance), y: Number(crazy), z: Number(materialistic) },
    ])
    setName('')
  }

  const togglePoint = (index) => {
    setPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, hidden: !p.hidden } : p))
    )
  }

  // 【修复 1】：把静态的 layout 放到外面，或者用 useMemo 缓存起来
  // 这样 React 每次重新渲染时，不会生成一个新的 layout 对象去刺激 Plotly
  const layout = useMemo(() => ({
    autosize: true,
    uirevision: 'true', // 这个依然保留
    showlegend: false,  
    scene: {
      aspectmode: 'cube',
      xaxis: { title: { text: '外貌指数' }, range: [-0.5, 10.5], autorange: false, tickvals: [0, 2, 4, 6, 8, 10], zeroline: false },
      yaxis: { title: { text: '作妖指数' }, range: [-0.5, 10.5], autorange: false, tickvals: [2, 4, 6, 8, 10], zeroline: false }, 
      zaxis: { title: { text: '拜金指数' }, range: [-0.5, 10.5], autorange: false, tickvals: [2, 4, 6, 8, 10], zeroline: false }, 
    },
    margin: { l: 0, r: 0, t: 40, b: 0 },
    title: { text: 'Jolie是爸爸', font: { size: 18 } },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
  }), []) // 空依赖数组，意味着它永远不会改变

  // 【修复 2】：使用 useMemo 缓存图表数据，只有当 points 或 showDiagonal 真正改变时才重新计算！
  const plotData = useMemo(() => {
    // 筛选出未被隐藏的点，为了让颜色能保持连续不重置，记录它们的 originalIndex
    const visiblePoints = points
      .map((p, index) => ({ ...p, originalIndex: index }))
      .filter((p) => !p.hidden)

    // 数据点图层
    const pointsTrace = {
      type: 'scatter3d',
      mode: 'markers+text',
      name: '数据点',
      showlegend: false,
      x: visiblePoints.map((p) => p.x),
      y: visiblePoints.map((p) => p.y),
      z: visiblePoints.map((p) => p.z),
      text: visiblePoints.map((p) => `<b>${p.name}</b>`),
      textfont: { size: 22, color: '#000', family: 'system-ui, sans-serif' },
      hovertext: visiblePoints.map((p) => p.name),
      hoverinfo: 'text',
      textposition: 'top center',
      marker: {
        size: 8,
        color: visiblePoints.map((p) => p.originalIndex),
        colorscale: 'Viridis',
        cmin: 0,
        cmax: Math.max(1, points.length - 1), 
        opacity: 0.9,
      },
    }

    // 对角线图层
    const diagonalTrace = {
      type: 'scatter3d',
      mode: 'lines',
      x: [0, 10],
      y: [0, 10],
      z: [0, 10],
      line: {
        color: '#ff4d4f',
        width: 3,
        dash: 'dash',
      },
      hoverinfo: 'none',
      showlegend: false,
      // 【修复 3】：关键在这里！数组长度永远是 2，我们只通过 visible 来切换显示状态
      visible: showDiagonal ? true : false 
    }

    return [pointsTrace, diagonalTrace]
  }, [points, showDiagonal]) // 只有这两个变量变化时，Plotly 才会收到新数据

  return (
    <div className="app-container">
      <div className="plot-panel">
        <Plot
          data={plotData}
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
              min="0"
              max="10"
              step="0.5"
              value={crazy}
              onChange={(e) => setCrazy(e.target.value)}
              className="slider"
            />
            <span className="range-hint">0 — 10</span>
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

          <button 
            type="button" 
            className="submit-btn" 
            style={{ backgroundColor: showDiagonal ? '#ff4d4f' : '#6b6375' }} 
            onClick={() => setShowDiagonal(!showDiagonal)}
          >
            {showDiagonal ? '隐藏主对角线' : '显示 0-10 对角线'}
          </button>
        </form>

        {points.length > 0 && (
          <div className="points-list">
            <h2 className="list-title">已添加的点 ({points.length})</h2>
            <ul>
              {points.map((p, i) => (
                <li 
                  key={i} 
                  className={`point-item ${p.hidden ? 'hidden' : ''}`}
                  onClick={() => togglePoint(i)}
                  style={{
                    cursor: 'pointer',
                    opacity: p.hidden ? 0.4 : 1,
                    filter: p.hidden ? 'grayscale(1)' : 'none',
                    transition: 'all 0.2s',
                    textDecoration: p.hidden ? 'line-through' : 'none'
                  }}
                  title={p.hidden ? "点击恢复显示" : "点击隐藏该点"}
                >
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
