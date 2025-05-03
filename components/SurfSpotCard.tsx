// components/SurfSpotCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { SurfSpot } from '@/lib/surfSpots'

interface SurfSpotCardProps {
  spot: SurfSpot
}

interface WindyResponse {
  ts: number[];
  units: {
    'wind_u-surface'?: string;
    'wind_v-surface'?: string;
    'gust-surface'?: string;
    'waves_height-surface'?: string;
    'waves_period-surface'?: string;
    'waves_direction-surface'?: string;
    'wwaves_height-surface'?: string;
    'wwaves_period-surface'?: string;
    'wwaves_direction-surface'?: string;
    'swell1_height-surface'?: string;
    'swell1_period-surface'?: string;
    'swell1_direction-surface'?: string;
    'swell2_height-surface'?: string;
    'swell2_period-surface'?: string;
    'swell2_direction-surface'?: string;
  };
  'wind_u-surface'?: number[];
  'wind_v-surface'?: number[];
  'gust-surface'?: number[];
  'waves_height-surface'?: number[];
  'waves_period-surface'?: number[];
  'waves_direction-surface'?: number[];
  'wwaves_height-surface'?: number[];
  'wwaves_period-surface'?: number[];
  'wwaves_direction-surface'?: number[];
  'swell1_height-surface'?: number[];
  'swell1_period-surface'?: number[];
  'swell1_direction-surface'?: number[];
  'swell2_height-surface'?: number[];
  'swell2_period-surface'?: number[];
  'swell2_direction-surface'?: number[];
}

export default function SurfSpotCard({ spot }: SurfSpotCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [weatherData, setWeatherData] = useState<WindyResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 風速と風向を計算
  const calculateWindSpeedAndDirection = (u: number, v: number) => {
    const speed = Math.sqrt(u * u + v * v);
    let direction = (270 - Math.atan2(v, u) * 180 / Math.PI) % 360;
    if (direction < 0) direction += 360;
    
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(direction / 45) % 8;
    
    return {
      speed: speed * 3.6, // m/s to km/h
      direction: directions[index]
    };
  };

  // 波の方向を取得
  const getDirection = (degrees: number | undefined) => {
    if (degrees === undefined) return 'N/A';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: spot.latitude,
            longitude: spot.longitude,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        console.log('Received weather data:', data);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [spot.latitude, spot.longitude]);

  if (loading && !weatherData) {
    return (
      <div className="mb-4 rounded-2xl bg-white shadow-sm p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-2xl bg-white shadow-sm p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!weatherData || !weatherData.ts) {
    return (
      <div className="mb-4 rounded-2xl bg-white shadow-sm p-4">
        <div className="text-yellow-600">No data available for {spot.name}</div>
      </div>
    );
  }

  const currentIndex = 0;
  
  // データの存在チェック
  const windU = weatherData['wind_u-surface'];
  const windV = weatherData['wind_v-surface'];
  const gust = weatherData['gust-surface'];
  const wavesHeight = weatherData['waves_height-surface'];
  const wavesPeriod = weatherData['waves_period-surface'];
  const wavesDirection = weatherData['waves_direction-surface'];
  const windWavesHeight = weatherData['wwaves_height-surface'];
  const swell1Height = weatherData['swell1_height-surface'];
  const swell2Height = weatherData['swell2_height-surface'];

  const hasWindData = windU && windV && 
                     windU.length > currentIndex && 
                     windV.length > currentIndex;
  
  const currentWind = hasWindData ? calculateWindSpeedAndDirection(
    windU[currentIndex],
    windV[currentIndex]
  ) : { speed: 0, direction: 'N/A' };
  
  const currentWaveHeight = wavesHeight?.[currentIndex];
  const currentWavePeriod = wavesPeriod?.[currentIndex];
  const currentWaveDirection = wavesDirection?.[currentIndex];

  return (
    <div className="mb-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* 左側：スポット情報 */}
          <div className="flex-1">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">{spot.name}</h2>
            <div className="flex gap-3 sm:gap-6 text-sm text-gray-600 flex-wrap">
              {currentWaveHeight !== undefined && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-water text-sky-500"></i>
                  <span>{currentWaveHeight.toFixed(1)}m</span>
                </div>
              )}
              {currentWavePeriod !== undefined && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock text-sky-500"></i>
                  <span>{currentWavePeriod.toFixed(0)}s</span>
                </div>
              )}
              {hasWindData && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-wind text-sky-500"></i>
                  <span>{currentWind.speed.toFixed(0)}km/h</span>
                </div>
              )}
              {hasWindData && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-compass text-sky-500"></i>
                  <span>{currentWind.direction}</span>
                </div>
              )}
            </div>
          </div>

          {/* 右側：アクションボタン */}
          <div className="flex items-center gap-2">
            {/* View Cameraボタン - アイコンのみ */}
            {spot.cameraUrl ? (
              <a 
                href={spot.cameraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                title="View Camera"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fas fa-video"></i>
              </a>
            ) : (
              <a 
                href={`https://www.windyty.com/?${spot.latitude},${spot.longitude},11`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                title="View on Windy"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fas fa-wind"></i>
              </a>
            )}

            {/* トグルボタン - アイコンのみ */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isOpen 
                  ? 'bg-sky-500 text-white hover:bg-sky-600' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title={isOpen ? 'Close Details' : 'View Details'}
            >
              <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* 展開時の詳細情報 */}
      {isOpen && weatherData && (
        <div className="border-t border-gray-100 p-4">
          {/* 波の詳細情報 */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Wave Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Total Waves</div>
                <div className="text-lg font-bold text-gray-900">
                  {currentWaveHeight?.toFixed(1) || 'N/A'}m
                </div>
                <div className="text-sm text-gray-600">
                  {currentWavePeriod?.toFixed(0) || 'N/A'}s / {getDirection(currentWaveDirection)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Wind Waves</div>
                <div className="text-lg font-bold text-gray-900">
                  {windWavesHeight?.[currentIndex]?.toFixed(1) || 'N/A'}m
                </div>
                <div className="text-sm text-gray-600">
                  {weatherData['wwaves_period-surface']?.[currentIndex]?.toFixed(0) || 'N/A'}s / 
                  {getDirection(weatherData['wwaves_direction-surface']?.[currentIndex])}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Swell 1</div>
                <div className="text-lg font-bold text-gray-900">
                  {swell1Height?.[currentIndex]?.toFixed(1) || 'N/A'}m
                </div>
                <div className="text-sm text-gray-600">
                  {weatherData['swell1_period-surface']?.[currentIndex]?.toFixed(0) || 'N/A'}s / 
                  {getDirection(weatherData['swell1_direction-surface']?.[currentIndex])}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Swell 2</div>
                <div className="text-lg font-bold text-gray-900">
                  {swell2Height?.[currentIndex]?.toFixed(1) || 'N/A'}m
                </div>
                <div className="text-sm text-gray-600">
                  {weatherData['swell2_period-surface']?.[currentIndex]?.toFixed(0) || 'N/A'}s / 
                  {getDirection(weatherData['swell2_direction-surface']?.[currentIndex])}
                </div>
              </div>
            </div>
          </div>

          {/* 時間ごとの予報テーブル */}
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Hourly Forecast
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50">
                    <th className="py-3 text-left font-semibold text-gray-600">Time</th>
                    <th className="py-3 text-left font-semibold text-gray-600">Waves</th>
                    <th className="py-3 text-left font-semibold text-gray-600">Period</th>
                    <th className="py-3 text-left font-semibold text-gray-600">Direction</th>
                    <th className="py-3 text-left font-semibold text-gray-600">Wind</th>
                    <th className="py-3 text-left font-semibold text-gray-600">Gusts</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData.ts.slice(0, 8).map((timestamp, idx) => {
                    const date = new Date(timestamp);
                    const wind = windU?.[idx] !== undefined && windV?.[idx] !== undefined ?
                      calculateWindSpeedAndDirection(windU[idx], windV[idx]) : null;
                    
                    return (
                      <tr key={timestamp} className="border-b border-gray-50">
                        <td className="py-3 text-gray-600">
                          {date.toLocaleTimeString('en-AU', { 
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </td>
                        <td className="py-3 text-gray-600">
                          {wavesHeight?.[idx]?.toFixed(1) || 'N/A'}m
                        </td>
                        <td className="py-3 text-gray-600">
                          {wavesPeriod?.[idx]?.toFixed(0) || 'N/A'}s
                        </td>
                        <td className="py-3 text-gray-600">
                          {getDirection(wavesDirection?.[idx])}
                        </td>
                        <td className="py-3 text-gray-600">
                          {wind ? `${wind.speed.toFixed(0)}km/h ${wind.direction}` : 'N/A'}
                        </td>
                        <td className="py-3 text-gray-600">
                          {gust?.[idx] !== undefined ? 
                            `${(gust[idx] * 3.6).toFixed(0)}km/h` : 
                            'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}