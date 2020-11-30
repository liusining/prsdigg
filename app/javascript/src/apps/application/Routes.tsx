import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoadingComponent from './components/LoadingComponent/LoadingComponent';
const ArticleEditPage = React.lazy(
  () => import('./pages/ArticleEditPage/ArticleEditPage'),
);
const ArticleNewPage = React.lazy(
  () => import('./pages/ArticleNewPage/ArticleNewPage'),
);
const ArticlePage = React.lazy(() => import('./pages/ArticlePage/ArticlePage'));
const CommnunityPage = React.lazy(
  () => import('./pages/CommnunityPage/CommunityPage'),
);
const FairPage = React.lazy(() => import('./pages/FairPage/FairPage'));
const HomePage = React.lazy(() => import('./pages/HomePage/HomePage'));
const MinePage = React.lazy(() => import('./pages/MinePage/MinePage'));
const NotFoundPage = React.lazy(
  () => import('./pages/NotFoundPage/NotFoundPage'),
);
const RulesPage = React.lazy(() => import('./pages/RulesPage/RulesPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage/SearchPage'));
const UserPage = React.lazy(() => import('./pages/UserPage/UserPage'));

export default function Routes() {
  return (
    <React.Fragment>
      <Suspense fallback={<LoadingComponent />}>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
          <Route path='/articles/new' exact>
            <ArticleNewPage />
          </Route>
          <Route path='/articles/:uuid' exact>
            <ArticlePage />
          </Route>
          <Route path='/articles/:uuid/edit' exact>
            <ArticleEditPage />
          </Route>
          <Route path='/users/:mixinId' exact>
            <UserPage />
          </Route>
          <Route path='/search' exact>
            <SearchPage />
          </Route>
          <Route path='/rules' exact>
            <RulesPage />
          </Route>
          <Route path='/mine' exact>
            <MinePage />
          </Route>
          <Route path='/fair' exact>
            <FairPage />
          </Route>
          <Route path='/community' exact>
            <CommnunityPage />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Suspense>
    </React.Fragment>
  );
}
