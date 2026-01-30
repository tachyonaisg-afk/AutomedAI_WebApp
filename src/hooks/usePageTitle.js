import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `AutoMedAI - ${title}` : 'AutoMedAI';

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default usePageTitle;
