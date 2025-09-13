import React from 'react';
import { Image, ImageProps, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string } | number;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  lazy?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  placeholder,
  fallback,
  lazy = true,
  style,
  ...props
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [shouldLoad, setShouldLoad] = React.useState(!lazy);
  const { colors } = useTheme();

  React.useEffect(() => {
    if (lazy) {
      // Lazy load after a short delay
      const timer = setTimeout(() => setShouldLoad(true), 100);
      return () => clearTimeout(timer);
    }
  }, [lazy]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (!shouldLoad) {
    return placeholder ? (
      <View style={style}>{placeholder}</View>
    ) : (
      <View style={[style, { backgroundColor: colors.border }]} />
    );
  }

  if (error && fallback) {
    return <View style={style}>{fallback}</View>;
  }

  return (
    <View style={style}>
      <Image
        {...props}
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoad={handleLoad}
        onError={handleError}
        // Performance optimizations
        resizeMode="cover"
        fadeDuration={200}
      />
      {loading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.border,
        }}>
          {placeholder || <ActivityIndicator size="small" color={colors.primary} />}
        </View>
      )}
    </View>
  );
};

export default OptimizedImage;