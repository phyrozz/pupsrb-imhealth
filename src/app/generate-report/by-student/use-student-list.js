import React from "react"

export function useStudentList({ supabase, filterText }) {
  const [items, setItems] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const limit = 10; // Number of items per page, adjust as necessary

  const loadStudent = React.useCallback(async () => {  
    try {
      setIsLoading(true);
  
      let { data: studentData, error } = await supabase
        .from("personal_details")
        .select(`first_name, middle_name, last_name, name_suffix, student_number, profiles!inner(id)`)
        .or(
          `first_name.ilike.%${filterText}%,middle_name.ilike.%${filterText}%,last_name.ilike.%${filterText}%,name_suffix.ilike.%${filterText}%,student_number.ilike.%${filterText}%`
        )
        .range(offset, offset + limit - 1);
  
      if (error) {
        throw error;
      }
  
      setHasMore(studentData.length === limit);
      // If it's the first page, set the items directly
      if (offset === 0) {
        setItems(studentData);
      } else {
        // If it's not the first page, append new results to existing ones
        setItems((prevItems) => [...prevItems, ...studentData]);
      }
    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
    } finally {
      setIsLoading(false)
    }
  }, [filterText, offset, supabase])

  React.useEffect(() => {
    loadStudent()
  }, [filterText, loadStudent, offset])

  const onLoadMore = () => {
    const newOffset = offset + limit;

    setOffset(newOffset);
  };

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore,
  };
}
