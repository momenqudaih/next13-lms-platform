import { render, screen } from '@testing-library/react';
import { CourseCard } from '@/components/course-card';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock components
jest.mock('@/components/icon-badge', () => ({
  IconBadge: ({ children }: any) => <div data-testid="icon-badge">{children}</div>
}));

jest.mock('@/components/course-progress', () => ({
  CourseProgress: ({ value }: any) => <div data-testid="course-progress">Progress: {value}%</div>
}));

jest.mock('@/lib/format', () => ({
  formatPrice: (price: number) => `$${price.toFixed(2)}`
}));

describe('CourseCard', () => {
  const defaultProps = {
    id: 'course-1',
    title: 'React Fundamentals',
    imageUrl: '/course-image.jpg',
    chaptersLength: 5,
    price: 29.99,
    category: 'Programming',
  };

  it('should render course information correctly', () => {
    render(<CourseCard {...defaultProps} />);

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('5 Chapters')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('should render course image with correct alt text', () => {
    render(<CourseCard {...defaultProps} />);

    const image = screen.getByAltText('React Fundamentals');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/course-image.jpg');
  });

  it('should render progress when provided', () => {
    render(<CourseCard {...defaultProps} progress={75} />);

    expect(screen.getByTestId('course-progress')).toBeInTheDocument();
    expect(screen.getByText('Progress: 75%')).toBeInTheDocument();
  });

  it('should not render progress when not provided', () => {
    render(<CourseCard {...defaultProps} />);

    expect(screen.queryByTestId('course-progress')).not.toBeInTheDocument();
  });

  it('should render "Free" when price is null', () => {
    render(<CourseCard {...defaultProps} price={null} />);

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.queryByText('$29.99')).not.toBeInTheDocument();
  });

  it('should have correct link to course page', () => {
    render(<CourseCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/courses/course-1');
  });

  it('should handle singular chapter count', () => {
    render(<CourseCard {...defaultProps} chaptersLength={1} />);

    expect(screen.getByText('1 Chapter')).toBeInTheDocument();
  });
});