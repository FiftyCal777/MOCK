import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/lib/auth';
import { useInstitution } from '@/lib/contexts/InstitutionContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, CheckCircle2, XCircle, User, Building2, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gooeyToast, GooeyToaster } from 'goey-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { resolvePhotoUrl } from '@/lib/photo';
import LoadingState from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { IdCardTemplate } from '@/components/IdCardTemplate';

interface VerificationResult {
  found: boolean;
  data?: {
    index_number: string;
    full_name: string;
    photo_url: string | null;
    organization: string;
    institutions: { name: string; logo_url: string | null } | null;
    issued_at: string;
    expires_at: string;
    status: string;
    metadata: Record<string, unknown> | null;
  };
}

export default function Verify() {
  const { user, isLoading: authLoading } = useAuth();
  const { institutionId, institution, isLoading: instLoading } = useInstitution();
  const [indexNumber, setIndexNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  // Resolve the record photo and institution logo URLs
  useEffect(() => {
    let cancelled = false;
    const photoUrl = result?.found ? result.data?.photo_url ?? null : null;
    const rawLogoUrl = result?.found
      ? (result.data?.institutions?.logo_url ?? (result.data?.metadata?.logo_url as string | undefined) ?? institution?.logo_url ?? null)
      : (institution?.logo_url ?? null);

    if (!photoUrl) {
      setPhotoSrc(null);
    } else {
      resolvePhotoUrl(photoUrl).then((resolved) => {
        if (!cancelled) setPhotoSrc(resolved);
      });
    }

    if (!rawLogoUrl) {
      setLogoSrc(null);
    } else {
      resolvePhotoUrl(rawLogoUrl).then((resolved) => {
        if (!cancelled) setLogoSrc(resolved || rawLogoUrl);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [result, institution]);

  const { toast } = useToast();

  if (authLoading || instLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingState label="Loading verification" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!institutionId) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="mx-auto max-w-xl border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="font-display text-lg">Access Restricted</CardTitle>
                  <CardDescription>
                    You must be a member of an institution to verify identities.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Join or register an institution from your dashboard to gain access to verification.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!indexNumber.trim()) {
      gooeyToast.error('Identification number required', {
        description: 'Please enter an identification number to verify.',
      });
      return;
    }

    setIsSearching(true);
    setResult(null);

    try {
      // Search for the index number
      const { data, error } = await supabase
        .from('index_records')
        .select('index_number, full_name, photo_url, organization, issued_at, expires_at, status, metadata, institutions(name, logo_url)')
        .eq('index_number', indexNumber.trim().toUpperCase())
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Search error:', error);
        gooeyToast.error('Search failed', {
          description: 'An error occurred while searching. Please try again.',
        });
        return;
      }

      // Log the verification attempt
      await supabase.from('verification_logs').insert({
        index_number: indexNumber.trim().toUpperCase(),
        verified_by: user.id,
        verification_result: data !== null,
        user_agent: navigator.userAgent,
        institution_id: institutionId,
      });

      if (!data) {
        gooeyToast.error('Not Found', {
          description: `No verified record matches identification number "${indexNumber.trim().toUpperCase()}".`,
          duration: 5000,
        });
      }

      setResult({
        found: data !== null,
        data: data
          ? { ...data, metadata: (data.metadata ?? null) as Record<string, unknown> | null }
          : undefined,
      });

    } catch (err) {
      console.error('Verification error:', err);
      gooeyToast.error('Error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const isExpired = result?.data?.expires_at && new Date(result.data.expires_at) < new Date();
  const isRegisteredStudent = result?.data ? result.data.metadata?.registered_student !== false : false;

  return (
    <Layout>
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl mb-2 text-slate-900 dark:text-slate-100">
              Verify Identity
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              Enter an identification number to verify someone's identity.
            </p>
          </div>

          <Card className="mb-10 border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="ENTER IDENTIFICATION..."
                    value={indexNumber}
                    onChange={(e) => setIndexNumber(e.target.value.toUpperCase())}
                    className="pl-10 uppercase text-xs sm:text-sm font-medium tracking-wide placeholder:text-slate-400 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
                  />
                </div>
                <Button type="submit" disabled={isSearching} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-5 border-0 font-medium shadow-sm">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {result && result.found && result.data && (
              <motion.div
                key="found-card"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              >
                <Card className="border-success/50 animate-scale-in overflow-hidden shadow-lg">
                  <CardHeader className="pb-4 bg-emerald-500/5 border-b border-emerald-500/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-display text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            Identity Verified
                          </CardTitle>
                          <CardDescription className="text-emerald-800/80 dark:text-emerald-300/80">
                            Record found in the database
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={isExpired ? 'destructive' : 'default'} className={!isExpired ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}>
                          {isExpired ? 'Expired' : 'Active'}
                        </Badge>
                        <Badge variant="outline" className={isRegisteredStudent ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400' : 'border-destructive text-destructive'}>
                          {isRegisteredStudent ? 'Registered' : 'Not Registered'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex flex-col items-center bg-slate-50 dark:bg-slate-900/50">
                    {isExpired && (
                      <div className="w-full mb-4 flex items-center gap-2 rounded-lg bg-amber-500/15 border border-amber-500/30 p-3 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">This ID card has expired</span>
                      </div>
                    )}

                    {/* Verified ID Card Template */}
                    <div className="w-full flex justify-center my-2">
                      <IdCardTemplate
                        indexNumber={result.data.index_number}
                        fullName={result.data.full_name}
                        photoUrl={photoSrc}
                        organization={result.data.organization}
                        institutionName={
                          (result.data.institutions?.name || institution?.name || '').toUpperCase().includes('GCTU')
                            ? 'GHANA COMMUNICATION TECHNOLOGY UNIVERSITY'
                            : result.data.institutions?.name || institution?.name || 'GHANA COMMUNICATION TECHNOLOGY UNIVERSITY'
                        }
                        logoUrl={logoSrc || result.data.institutions?.logo_url || (result.data.metadata?.logo_url as string) || institution?.logo_url || null}
                        role={(result.data.metadata?.role as string) || 'STUDENT'}
                        program={(result.data.metadata?.program as string) || result.data.organization}
                        motto={(result.data.metadata?.motto as string) || 'Knowledge Comes From Learning'}
                      />
                    </div>

                    {/* Additional Metadata Footer */}
                    <div className="w-full mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>Organization: <strong>{result.data.institutions?.name ?? result.data.organization}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Valid: {new Date(result.data.issued_at).toLocaleDateString()} – {new Date(result.data.expires_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result && !result.found && (
  <GooeyToaster position="top-left" />
)}
          </AnimatePresence>

          {!result && (
            <EmptyState />
          )}
        </div>
      </div>
    </Layout>
  );
}