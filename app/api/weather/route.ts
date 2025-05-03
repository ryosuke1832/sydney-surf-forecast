// app/api/weather/route.ts
import { NextResponse } from 'next/server';

// const WINDY_API_KEY = process.env.WINDY_API_KEY;
const WINDY_API_KEY = process.env.NEXT_PUBLIC_SURF_API_KEY;
const WINDY_API_ENDPOINT = 'https://api.windy.com/api/point-forecast/v2';

export async function POST(request: Request) {
  try {
    const { latitude, longitude } = await request.json();

    if (!WINDY_API_KEY) {
      throw new Error('Windy API key is not configured');
    }

    // 風データ用リクエスト（GFSモデル）
    const windRequest = {
      lat: latitude,
      lon: longitude,
      model: 'gfs',
      parameters: ['wind', 'windGust'],
      levels: ['surface'],
      key: WINDY_API_KEY,
    };

    // 波データ用リクエスト（GFS Waveモデル）
    const waveRequest = {
      lat: latitude,
      lon: longitude,
      model: 'gfsWave',
      parameters: ['waves', 'windWaves', 'swell1', 'swell2'],
      levels: ['surface'],
      key: WINDY_API_KEY,
    };

    console.log('Wind API Request:', windRequest);
    console.log('Wave API Request:', waveRequest);

    // 両方のリクエストを並行して実行
    const [windResponse, waveResponse] = await Promise.all([
      fetch(WINDY_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(windRequest),
      }),
      fetch(WINDY_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waveRequest),
      }),
    ]);

    if (!windResponse.ok) {
      const errorText = await windResponse.text();
      console.error('Wind API Error Response:', errorText);
      throw new Error(`Failed to fetch wind data: ${windResponse.status}`);
    }

    if (!waveResponse.ok) {
      const errorText = await waveResponse.text();
      console.error('Wave API Error Response:', errorText);
      throw new Error(`Failed to fetch wave data: ${waveResponse.status}`);
    }

    const windData = await windResponse.json();
    const waveData = await waveResponse.json();

    // データを結合
    const combinedData = {
      ts: windData.ts, // タイムスタンプは同じはず
      units: { ...windData.units, ...waveData.units },
      ...windData,
      ...waveData,
    };

    console.log('Combined API Response:', Object.keys(combinedData));
    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}