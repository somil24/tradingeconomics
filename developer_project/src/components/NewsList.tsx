import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Adjust imports based on your actual setup
import { Button } from "./ui/button";
import { Pagination } from "./ui/pagination";
import Link from "next/link";
import { NewsItem } from "@/lib/interfaces";

const NewsCard: React.FC<NewsItem> = (news) => {
  return (
    <Card className="h-64 flex flex-col justify-between">
      <CardHeader>
        <h2 className="text-lg font-semibold">{news.title}</h2>
        <p className="text-sm text-gray-500">
          {new Date(news.date).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
          {news.description}
        </p>
      </CardContent>
      <Link
        href={`https://tradingeconomics.com${news.url}`}
        target="_blank"
        className="m-2"
      >
        Read more
      </Link>
    </Card>
  );
};

interface NewsListProps {
  newsData: NewsItem[];
}

const NewsList: React.FC<NewsListProps> = ({ newsData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate the indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = newsData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentNews.map((news: NewsItem) => (
          <NewsCard key={news.id} {...news} />
        ))}
      </div>

      <Pagination className="mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Pagination>
    </div>
  );
};

export default NewsList;
