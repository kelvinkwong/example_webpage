function get_query_parameter(target) {
    if (location.search)
        for (query of location.search.slice(1).split('&'))
        {
            aquery = query.split('=');
            if (aquery[0] == target)
                return aquery[1];
        }
    return null;
}
