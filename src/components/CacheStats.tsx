import React, { memo, useMemo } from 'react';
import { Paper, Typography, Box, LinearProgress, styled } from '@mui/material';
import { useCacheStats } from '../hooks/useCacheStats';

const StatsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(2),
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

interface StatItemProps {
  label: string;
  value: string | number;
  progress?: number;
}

const StatItemComponent = memo(({ label, value, progress }: StatItemProps) => (
  <StatItem>
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
    {progress !== undefined ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress > 80 ? 'success' : 'primary'}
          />
        </Box>
        <Typography variant="body2">
          {value}
        </Typography>
      </Box>
    ) : (
      <Typography variant="body2">
        {value}
      </Typography>
    )}
  </StatItem>
));

StatItemComponent.displayName = 'StatItemComponent';

const CacheStats: React.FC = memo(() => {
  const stats = useCacheStats(1000); // Update every second

  const hitRatioPercentage = useMemo(() => {
    const ratio = (stats.hitRatio * 100);
    return {
      value: `${ratio.toFixed(1)}%`,
      progress: ratio
    };
  }, [stats.hitRatio]);

  const formattedSize = useMemo(() => 
    `${stats.size.toLocaleString()} / 1,000`,
    [stats.size]
  );

  const formattedHitsMisses = useMemo(() => 
    `${stats.hits.toLocaleString()} / ${stats.misses.toLocaleString()}`,
    [stats.hits, stats.misses]
  );

  const formattedEvictions = useMemo(() => 
    stats.evictions.toLocaleString(),
    [stats.evictions]
  );

  return (
    <StatsContainer>
      <StatItemComponent
        label="Cache Hit Ratio"
        value={hitRatioPercentage.value}
        progress={hitRatioPercentage.progress}
      />
      <StatItemComponent
        label="Cache Size"
        value={formattedSize}
      />
      <StatItemComponent
        label="Cache Hits/Misses"
        value={formattedHitsMisses}
      />
      <StatItemComponent
        label="Cache Evictions"
        value={formattedEvictions}
      />
    </StatsContainer>
  );
});

CacheStats.displayName = 'CacheStats';

export default CacheStats; 